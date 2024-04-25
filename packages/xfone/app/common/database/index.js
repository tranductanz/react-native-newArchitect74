import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import logger from '@nozbe/watermelondb/utils/common/logger';
import appSchema from './schema/app';
import History from './model/History';
import User from './model/User';
import Room from './model/Room';
import Message from './model/Message';
import Topic from './model/Topic';
import Group from './model/Group';
import migrations from './model/migrations';

export const getDatabase = () => {
    const adapter = new SQLiteAdapter({
        schema: appSchema,
        dbName: 'xfoneDB',
        jsi: true,
        onSetUpError: (error) => {
            console.log('onSetUpError: ', error);
        },
        migrations
    });

    return new Database({
        adapter,
        modelClasses: [History],
        actionsEnabled: true
    });
};

class DB {
    databases = {};

    get active() {
        return this.databases.shareDB || this.databases.activeDB;
    }

    get share() {
        return this.databases.shareDB;
    }

    set share(db) {
        this.databases.shareDB = db;
    }

    get servers() {
        return this.databases.serversDB;
    }

    setActiveDB() {
        try {
            this.databases.activeDB = getDatabase();
            console.log('SET ACTIVE DB:', this.databases);
        } catch (error) {
            console.log('SET ACTIVE DB ERROR:', error);
        }
    }
}

const db = new DB();
export default db;

if (!__DEV__) {
    logger.silence();
}
