const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const Student = require('../models/Student');
const Alert = require('../models/Alert');
const AuditLog = require('../models/AuditLog');
const Prediction = require('../models/Prediction');

const upload = multer({ dest: 'uploads/' });

// Promise wrapper for python script execution
// Promise wrapper for the new 8-layer AI pipeline execution
const runAIPipeline = () => {
  return new Promise((resolve, reject) => {
    // Windows paths or global python alias
    console.log("🚀 TRIGGERING 8-LAYER AI PIPELINE...");
    const pythonProcess = spawn('python', [
      path.join(__dirname, '../ml/master_pipeline.py')
    ], { 
      shell: true,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' } 
    });

    let outputData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
      console.log(`[PYTHON]: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`AI Pipeline exited with code ${code}: ${errorData}`));
      }
      resolve(outputData);
    });
    
    pythonProcess.on('error', (err) => {
      reject(new Error("Failed to start AI Pipeline: " + err.message));
    });
  });
};

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No CSV file uploaded' });
  }

  const targetPath = path.join(__dirname, '../ml/student_performance.csv');

  try {
    // Stage 1: Replace the master CSV file
    fs.copyFileSync(req.file.path, targetPath);
    try { fs.unlinkSync(req.file.path); } catch (e) {}

    // Stage 2: Trigger the 8-layer AI Pipeline
    await runAIPipeline();

    // Log the upload action
    await AuditLog.create({
      adminName: 'Super Admin',
      adminEmail: 'admin@eadif.com',
      action: 'UPLOAD_BATCH_CSV',
      details: `Successfully uploaded and re-trained model with new dataset.`
    });

    res.status(200).json({ 
      success: true, 
      message: `Successfully uploaded and executed 8-Layer AI Pipeline.`
    });

  } catch (err) {
    console.error("Batch Upload Error:", err);
  }
});

module.exports = router;
