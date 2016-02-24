module.exports = (text) => (
  new Promise((resolve, reject) => {
    try {
      const json = JSON.parse(text);
      resolve(JSON.stringify(json, null, 2));
    } catch (err) {
      reject(new Error({ msg: "Not valid JSON file", err }));
    }
  })
);
