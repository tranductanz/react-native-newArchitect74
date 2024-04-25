/* eslint-disable prettier/prettier */
import { Model } from '@nozbe/watermelondb';
import { field, children, date } from '@nozbe/watermelondb/decorators';

export default class Topic extends Model {
    static table = 'topics';

    static associations = {
        rooms: { type: 'has_many', foreignKey: 'tid' }
    };

    @field('tid') tid;

    @field('tname') tname;

    @field('status') status;

    @date('creatTime') creatTime;

    @children('rooms') rooms;
}
