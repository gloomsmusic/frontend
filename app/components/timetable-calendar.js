import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default class TimetableCalendar extends Component {
  @service
  store;

  @action
  calendarRemoveOccurrence() {}

  @action
  calendarEditOccurrence() {}

  @action
  calendarUpdateOccurrence() {}

  @action
  calendarAddOccurrence(event) {
    let scheduledShow = this.store.createRecord('scheduled-show', {
      title: event.title,
      start: event.startsAt,
      end: event.endsAt
    });
    //this.occurrences.pushObject(scheduledShow);
    scheduledShow.save().then((show) => {
      console.log('saved show!');
      //this.addOccurrence(show);
    }).catch((error) => {
      console.log(`error saving show: ${error}`);
    });
  }

  @action
  calendarClickOccurrence() {}

  @action
  calendarNavigate(event) {
    console.log(`on navigate: ${event.start}, ${event.end}`); // eslint-disable-line no-console
    let start = event.start.format('YYYY-MM-DD');
    this.reloadCalendar({ start: start, view: event.view});
  }
}
