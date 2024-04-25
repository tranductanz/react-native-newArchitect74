/* eslint-disable prettier/prettier */
import { Model } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export default class Group extends Model {
    static table = 'groups';

    static associations = {
        rooms: { type: 'belongs_to', key: 'rid' },
        users: { type: 'belongs_to', key: 'uid' }
    };

    @relation('rooms', 'rid') room;

    @relation('users', 'uid') user;
}
