const cron = require("node-cron");
const fs = require("fs");
const uploadFile = require("../models/upload.js");
const moment = require("moment");

const cronJob = (io) => {
  cron.schedule("* */24 * * *", async () => {
    const current = moment().toDate();

    const fileToDelete = await uploadFile.find({
      expiredAt: { $lte: current },
    });

    fileToDelete.forEach((file) => {
      let filePath = `${__dirname}/../${file.filepath}`;

      fs.unlinkSync(filePath, (err) => {
        if (error) {
          console.log(err);
        }
      });

      const deletedFile = uploadFile.deleteOne({ _id: file._id }).then(() => {
        io.emit("file-expired");
      });
    });
  });
};

module.exports = cronJob;
