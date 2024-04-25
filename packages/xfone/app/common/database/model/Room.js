/* eslint-disable prettier/prettier */
import { Model } from '@nozbe/watermelondb';
import {
    field,
    children,
    date,
    relation
} from '@nozbe/watermelondb/decorators';

export default class Room extends Model {
    static table = 'rooms';

    static associations = {
        messages: { type: 'has_many', foreignKey: 'rid' },
        topics: { type: 'belongs_to', key: 'tid' }
    };

    @field('rid') rid;

    @field('rname') rname;

    @date('_updated_at') _updated_at;

    @field('ravatar') ravatar;

    @field('rstatus') rstatus;

    @relation('topics', 'tid') topic;

    @children('messages') messages;
}
