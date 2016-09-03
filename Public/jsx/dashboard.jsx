require('./auth.js')();

$(document).ready(function() {
   var Poll = React.createClass({
        render: function() {
            var options = [];
            this.props.options
                              .forEach(function(element) {
                                    options.push(<li className="list-group-item option">
                                                        <span className="badge">{element.peopleVoted}</span>
                                                        {element.value}
                                                </li>)
                              })
            return  <div className='col-sm-8 col-sm-offset-2 poll'>
                        <div className='question'>
                            {this.props.question}
                        </div>
                        <ul className="list-group options">
                            {options}
                        </ul>
                    </div>
        }
    })
    
    var Polls = React.createClass({
        render: function() {
            var options = [];
            console.log(this.props.polls);
            this.props.polls.forEach(function(element) {
                                if(!element.deleted) {
                                    options.push( <a id={element._id} href={'/id/'+element._id}><Poll question={element.polls.question}
                                                options={element.polls.polls} /></a>)
                                }
                            })
                            
            return  <div className='container polls'>
                            {options.reverse()}
                    </div>
        }
    })
    
    
    $.getJSON('/dashboard/get', function(data) {
        ReactDOM.render(<Polls polls={data.polls}/>, document.getElementById('insertPolls'), function() {
            console.log('done');
        });
    })
})