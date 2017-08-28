import React, { Component } from 'react';
import Moment from 'moment';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

moment.locale('mx')

class Calendar extends React.Component {
  static defaultProps = {
    date: moment()
  };

  // static propTypes = {
  //   date: React.PropTypes.object.isRequired
  // };

  constructor(props) {
    super(props)
    this.days = this.days.bind(this)
  }

  days() {
    var days = []
    let range = moment.range(
      moment(this.props.date).startOf('month').startOf('week'),
      moment(this.props.date).endOf('month').endOf('week')
    )

    for (let day of range.by('days')) {
      let belongsToAsideMonth = !day.isSame(moment(this.props.date), 'month')
      console.log('belongsToAsideMonth')
      days.push(<li key={day.format('YYYY-MM-DD')} className={"day" + (belongsToAsideMonth ? ' pale' : '')}>{day.format(' D')}</li>)
    }

      console.log("Days", moment.range(
        moment(this.props.date).startOf('month').startOf('week'),
        moment(this.props.date).endOf('month').endOf('week')
      ).by('days', (day) => {

        let belongsToAsideMonth = !day.isSame(moment(this.props.date), 'month')
        days.push(<li key={day.format('YYYY-MM-DD')} className={"day" + (belongsToAsideMonth ? ' pale' : '')}>{day.format('D')}</li>)
      }));
    return days;
  }

  dayHeaders() {
    var dayHeaders = []

    let range = moment.range(
      moment(this.props.date).startOf('week'),
      moment(this.props.date).endOf('week')
    )

    for (let moment of range.by('days')) {
      dayHeaders.push(<li key={moment.format('YYYYMMDD')} className="dayHeader">{moment.format('dd')}</li>)
    }

    return dayHeaders;
  }

  render() {
    return (
      <div className="calendar">
        <div className="goPreviousMonth">
          <i className="icono-caretLeftCircle" onClick={this.props.onMonthDecrement} />
        </div>
        <p className="monthHeader"><input value={this.props.date} onChange={this.props.onDateChange} /> — {moment(this.props.date).format('MMMM YYYY')}</p>
        <div className="goNextMonth">
          <i className="icono-caretRightCircle" onClick={this.props.onMonthIncrement} />
        </div>
        <ul className="days">
          {this.dayHeaders()}
          {this.days()}
        </ul>
      </div>
    );
  }
}

var store = createStore((state = {date: moment().format('YYYY-MM-DD')}, action) => {
  switch (action.type) {
    case 'INCREMENT_MONTH':
      return {date: moment(state.date).add(1, 'months')}
    case 'DECREMENT_MONTH':
      return {date: moment(state.date).subtract(1, 'months')}
    case 'CHANGE_DATE':
      console.log('CHANGE_DATE', action)
      return {date: action['date']}
    default:
      return state
  }
})

function render() {
  ReactDOM.render(
    <Calendar
      onMonthIncrement={() => store.dispatch({ type: 'INCREMENT_MONTH' })}
      onMonthDecrement={() => store.dispatch({ type: 'DECREMENT_MONTH' })}
      onDateChange={(e) => { store.dispatch({type: 'CHANGE_DATE', date: e.target.value}) }}
      {...store.getState()}
    />,
    document.getElementById('root')
  )
}

render()

store.subscribe(render)
