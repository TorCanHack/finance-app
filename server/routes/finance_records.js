const express = require("express");
const router = express.Router();
const fs = require('fs').promises; 
const path = require('path');




router.get('/records', async (req, res) => {
    const filePath = path.join(__dirname, '../data/data.json');
    try {
        const data = await fs.readFile(filePath, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        console.error("Error reading JSON file:", err);
        res.status(500).json({ message: 'Error reading data' });
    }
});

router.post('/records', async (req, res) => {

    const filePath = path.join(__dirname, '../data/data.json');
    try {
        const rawData = await fs.readFile(filePath, 'utf8')
        const data = JSON.parse(rawData)

        //Add ids to existing records if they dont have
        if (data.budgets) {
            data.budgets = data.budgets.map(record => 
                record.id ? record : {...record, id: Date.now() + Math.random()}
            )
        }

        if (data.pota) {
            data.pots = data.pots.map(record => 
                record.id ? record : {...record, id: Date.now() + Math.random()}
            )
        }

        const recordType = req.body.type;

        const newRecord = {
            id: Date.now() + Math.random(),
            ...req.body,
            date: new Date().toISOString()
        }

        //remove type from the record before saving
        delete newRecord.type;

        // Add new record to the appropriate collection
        if (recordType === 'budget'){
            if (!data.budget) data.budget = []
            data.budget.push(newRecord)
        } else if (recordType === 'pots') {
            if (!data.pots) data.pots = []
            data.pots.push(newRecord)      
        } else {
            return res.status(400).json({message: "Invalid record type, use \"Budget\" or \"pots\""})
        }

        //write updated data back to the file
        await fs.writeFile(filePath, JSON.stringify(data, null, 2))

        res.status(201).json(newRecord);

    } catch (err) {
        console.error("error creating new record", err)
        res.status(500).json({ message: "Error creating new record", Error: err.message})
    }

})

router.put('/records/:type/:id', async (req, res) => {
    const filePath = path.join(__dirname, '../data/data.json')
    const recordId = parseInt(req.params.id)
    const recordType = req.params.type;

    try {
        //read the existing data
        const rawData = fs.readFile(filePath, 'utf8');
        let data = JSON.parse(rawData);


        //validate record type
        if (recordType !== "budget" && recordType !== "pots") {
            res.status(400).json({message: "Invalid record type. Use Budgets or Pots."})
        }

        //find the index of the record to update
        const recordIndex = data[recordType].findIndex(record => record.id === recordId);

        if (recordIndex === -1){
            return res.status(404).json({message: 'Record not found'})
        }

        //update the record
        data[recordType][recordId] = {
            ...data[recordType][recordId],
            ...req.body,
            date: new Date().toISOString()
        };

        //write updated data back to the file
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));

        res.json(data[recordType][recordIndex])
    } catch (err) {
        console.error("Error updating record:", err)
        res.status(500).json({ message: "Error updating record", error: err.message})
    }
})

router.delete('records/:type/:id', async (req, res) => {
    const filePath = path.join(__dirname, '../data/data.json');
    const recordId = parseInt(req.params.id);
    const recordType = req.params.type;
    
    try {
          // Read existing data
          const rawData = await fs.readFile(filePath, 'utf8');
          let data = JSON.parse(rawData);
          
          // Validate record type
          if (recordType !== 'budget' && recordType !== 'pots') {
              return res.status(400).json({ message: 'Invalid record type. Use "budget" or "pots".' });
          }
          
          // Find the index of the record to delete
          const recordIndex = data[recordType].findIndex(record => record.id === recordId);
          
          // If record not found, return 404
          if (recordIndex === -1) {
              return res.status(404).json({ message: 'Record not found' });
          }
        
          const deleteRecord = data[recordType].splice(recordIndex, 1)[0]

          await fs.writeFile(filePath, JSON.stringify(data, null, 2))

          res.json(deleteRecord)
    } catch (err) {
        console.error("Error deleting record:", err);
        res.status(500).json({ message: 'Error deleting record', error: err.message });
    }
})
module.exports = router;

