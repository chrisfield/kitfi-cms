import fetch from 'isomorphic-unfetch';

export default class extends React.Component {
  static async getInitialProps ({ req }) {
    if (req) {
      console.log('Get data direct from mongoDb');
      // If `req` is defined, we're rendering on the server
      const { db } = req;
      // Note that `db` above comes from express middleware
      const list = await db.collection('Book').find().sort({ createdAt: -1 })
        .toArray();
      return { list };
    }

    const  list = await fetch('http://localhost:3000/book1')
      .then(res => res.json());
    console.log('Get data via api');
    return { list };
  }
  
  render() {
    return (
      <ul>
        {this.props.list.map((item, index) => (
          <li key={index}>
            {item.author} - {item.title}
          </li>
        ))}
      </ul>
    );
  }

}