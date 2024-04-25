import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
    version: 2,
    tables: [
        tableSchema({
            name: 'histories',
            columns: [
                { name: 'receiverUsername', type: 'string' },
                { name: 'startTime', type: 'number' },
                { name: 'duration', type: 'number' },
                { name: 'imageReceiver', type: 'string' },
                { name: 'audioCallStatus', type: 'string' },
                { name: 'firstNameReceiver', type: 'string' },
                { name: 'lastNameReceiver', type: 'string' },
                { name: 'hideNumber', type: 'boolean' },
                { name: 'phoneReceiver', type: 'string', isIndexed: true }
            ]
        })
    ]
});
