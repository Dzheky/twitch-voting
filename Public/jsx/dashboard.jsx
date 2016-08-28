require('./auth.js')();

$(document).ready(function() {
   var Poll = React.createClass({
        render: function() {
            return  <div className='poll'>
                        <div className='question'>
                            {this.props.question}
                        </div>
                        <div className='options'>
                            {this.props.options
                              .forEach(function(element) {
                                    return <div className='option'>
                                                {element.value + ' ' + element.peopleVoted}
                                            </div>
                              })
                            }
                        </div>
                    </div>
        }
    })
    
    var Polls = React.createClass({
        render: function() {
            return  <div className='polls'>
                        {this.props.polls
                            .forEach(function(element) {
                                return <Poll question={element.question}
                                            options={element.polls} ></Poll>
                            })
                        }
                    </div>
        }
    })
})