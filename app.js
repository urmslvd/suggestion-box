import React from "react";
import Firebase from "firebase";
import config from "./config.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    Firebase.initializeApp(config);

    this.state = {
      notes: []
    };
  }

  componentDidMount() {
    this.getNote();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      this.addNote();
    }
  }

  addNote = () => {
    Firebase.database()
      .ref("/")
      .set(this.state);
    console.log("DATA SAVED");
  };

  getNote = () => {
    let ref = Firebase.database().ref("/");
    ref.on("value", snapshot => {
      const state = snapshot.val();
      this.setState(state);
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    let title = this.refs.title.value;
    let content = this.refs.content.value;
    let id = this.refs.id.value;

    if (id && title && content) {
      const { notes } = this.state;
      const devIndex = notes.findIndex(data => {
        return data.id === id;
      });
      notes[devIndex].title = title;
      notes[devIndex].content = content;
      this.setState({ notes });
    } else if (title && content) {
      const id = new Date().getTime().toString();
      const { notes } = this.state;
      notes.push({ id, title, content });
      this.setState({ notes });
    }

    this.refs.title.value = "";
    this.refs.content.value = "";
    this.refs.id.value = "";
  };

  removeData = note => {
    const { notes } = this.state;
    const newState = notes.filter(data => {
      return data.id !== note.id;
    });
    this.setState({ notes: newState });
  };

  updateData = note => {
    this.refs.id.value = note.id;
    this.refs.title.value = note.title;
    this.refs.content.value = note.content;
  };

  render() {
    const { notes } = this.state;
    return (
      <React.Fragment>
      <header>
        <h2>
            ResLife Suggestion-Box
        </h2>
    </header>

    <div>
      <form onSubmit={this.handleSubmit}>
      <input type="hidden" ref="id" />
        <input
        type="text"
        ref="title"
        placeholder="Heading"
        />
        <textarea
          type="text"
          ref="content"
          placeholder="Enter suggestion.."
          rows="3"
        />
        <button type = "submit">Add</button>
      </form>
      
      <div>
      {notes.map(note => (
        <div
        key={note.id}
        className="note">

      <h1>{note.title}</h1>
      <p>{note.content}</p>
      <button
        onClick={() => this.removeData(note)}
        > Delete
      </button>
      <button
        onClick={() => this.updateData(note)}
        >Edit
        </button>
        </div>
      ))}
      </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;