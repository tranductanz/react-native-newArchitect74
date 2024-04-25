/* eslint-disable prettier/prettier */
import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';

export default class Histories extends Model {
    static table = 'histories';

    @field('receiverUsername') receiverUsername;

    @field('startTime') startTime;

    @field('duration') duration;

    @field('imageReceiver') imageReceiver;

    @field('audioCallStatus') audioCallStatus;

    @field('firstNameReceiver') firstNameReceiver;

    @field('lastNameReceiver') lastNameReceiver;

    @field('hideNumber') hideNumber;

    @field('phoneReceiver') phoneReceiver;
}
