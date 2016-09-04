require('./auth.js')();

$(document).ready(function() {
   var Poll = React.createClass({
        getInitialState: function() {
            return {visible: 'block'};
        },
        render: function() {
            var self = this;
            function deleted() {
                $.getJSON('/delete/'+self.props.id, function(result) {
                    if(!result.msg) {
                        alert(result.error);
                    } else {
                        self.setState({visible: 'none'});
                    }
                })
            }
            var options = [];
            this.props.options
                              .forEach(function(element) {
                                    options.push(<li className="list-group-item option">
                                                        <span className="badge">{element.peopleVoted}</span>
                                                        {element.value}
                                                </li>)
                              })
            return  <div className='col-sm-8 col-sm-offset-2 poll' style={{display: this.state.visible}}>
                        <div id='delete' onClick={deleted}>x</div>
                        <a href={this.props.href} id={this.props.id}>
                            <div className='question'>
                                {this.props.question}
                            </div>
                        </a>
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
                                    options.push(<Poll id={element._id} href={'/id/'+element._id} question={element.polls.question}
                                                options={element.polls.polls} />)
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