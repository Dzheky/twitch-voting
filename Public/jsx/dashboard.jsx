require('./auth.js')();

$(document).ready(function() {
   var Poll = React.createClass({
        render: function() {
            var options = [];
            this.props.options
                              .forEach(function(element) {
                                    options.push(<div className='option'>
                                                    {element.value + ' ' + element.peopleVoted}
                                                </div>)
                              })
            console.log(this.props.question)
            console.log(this.props.options)
            return  <div className='col-xs-12 poll'>
                        <div className='question'>
                            {this.props.question}
                        </div>
                        <div className='options'>
                            {options}
                        </div>
                    </div>
        }
    })
    
    var Polls = React.createClass({
        render: function() {
            var options = [];
            this.props.polls.forEach(function(element) {
                                options.push( <Poll question={element.polls.question}
                                            options={element.polls.polls} />)
                            })
                            
            return  <div className='container polls'>
                        {options}
                    </div>
        }
    })
    
    
    $.getJSON('/dashboard/get', function(data) {
        ReactDOM.render(<Polls polls={data.polls}/>, document.getElementById('insertPolls'), function() {
            console.log('done');
        });
    })
})