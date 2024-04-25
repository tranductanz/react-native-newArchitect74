import {
    createTable,
    schemaMigrations
} from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
    migrations: [
        // We'll add migration definitions here later
        {
            toVersion: 2,
            steps: [
                createTable({
                    name: 'users',
                    columns: [
                        { name: 'uid', type: 'string', isIndexed: true },
                        { name: 'name', type: 'string', isOptional: true },
                        { name: 'username', type: 'string' }
                    ]
                }),
                createTable({
                    name: 'rooms',
                    columns: [
                        { name: 'rid', type: 'string', isIndexed: true },
                        { name: 'rname', type: 'string', isOptional: true },
                        { name: 'rstatus', type: 'string', isOptional: true },
                        { name: 'ravatar', type: 'string', isOptional: true },
                        { name: '_updated_at', type: 'number' },
                        { name: 'tid', type: 'string' }
                    ]
                }),
                createTable({
                    name: 'topics',
                    columns: [
                        { name: 'tid', type: 'string', isIndexed: true },
                        { name: 'tname', type: 'string', isOptional: true },
                        { name: 'status', type: 'string', isOptional: true },
                        { name: 'creatTime', type: 'number' }
                    ]
                }),
                createTable({
                    name: 'messages',
                    columns: [
                        { name: 'msg', type: 'string' },
                        { name: 'ack', type: 'string' },
                        { name: 'rid', type: 'string' },
                        { name: 'type', type: 'string' },
                        {
                            name: '_updated_at',
                            type: 'number',
                            isIndexed: true
                        },
                        { name: 'edited_by', type: 'string', isOptional: true },
                        {
                            name: 'attachments',
                            type: 'string',
                            isOptional: true
                        },
                        { name: 'receivers', type: 'string', isOptional: true },
                        { name: 'seens', type: 'string', isOptional: true },
                        { name: 'emoji', type: 'string', isOptional: true },
                        { name: 'alias', type: 'string', isOptional: true },
                        { name: 'replies', type: 'string', isOptional: true },
                        { name: 'mentions', type: 'string', isOptional: true },
                        { name: 'isDeleted', type: 'boolean' }
                    ]
                }),
                createTable({
                    name: 'groups',
                    columns: [
                        { name: 'rid', type: 'string' },
                        { name: 'uid', type: 'string' }
                    ]
                })
            ]
        }
    ]
});
