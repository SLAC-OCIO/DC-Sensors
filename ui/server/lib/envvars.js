/**
 * Created by xalg on 9/2/15.
 */

Meteor.startup(function () {
    var inDevelopment = function () {
        return process.env.NODE_ENV === "development";
    };

    var inProduction = function () {
        return process.env.NODE_ENV === "production";
    };
    if (inProduction()) {
    process.env.MONGO_URL = 'mongodb://localhost:27017/dc';
    }
    if (inDevelopment()===true){
        console.log("DB is local, this is not production");
    }
    if (inProduction()===true){
        console.log("DB is standalone as you are in production mode");
    }
});