import sequelize from "./sequelize.js";

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connect successfully");
  } catch (error) {
    console.log(`Database connect failder ${error.message}`);
    process.exit(1);
  }
};

export default connectDatabase;
