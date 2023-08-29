import {Field, Formik, Form} from 'formik';
import flatshare from "./assets/flatshare.jpg";
import axios from 'axios';

function App() {
  const styles = {
    element: ['h-10', 'mx-5', 'text-xl'].join(' '),
    label: ['mt-2', 'font-bold'].join(' '),
    field: ['opacity-80', 'rounded-lg', 'shadow-lg'].join(' '),
    textArea: ['opacity-80', 'mx-5', 'h-56', 'rounded-lg', 'shadow-lg'].join(' '),
    button: ['font-bold','text-xl', 'my-5', 'rounded-lg', 'bg-white', 'shadow-lg', 'bg-gradient-to-t', 'from-lime-200','sm:w-96', 'sm:mx-auto', 'mt-6'].join(' ')
  };
  const {field, textArea, label, element, button} = styles;

  const postData = (url,data) => {
    axios.post(url,data).then(res=>{
      console.info('posted data:',res.data)
    }).catch(err=>{
      console.info('error',err);
    })
  }

  return (
    <div style={{backgroundImage:`url(${flatshare})`}} className="bg-no-repeat bg-right bg-cover min-h-screen w-screen flex ">
      <div className="min-h-full w-screen bg-lime-300 bg-opacity-10 flex flex-col">
        <h1 className="text-3xl text-center sm:mt-40 mt-10 md:mt-10 mb-4">WG-Gesucht App</h1>
        <Formik
          initialValues={{email:'',password:'',url:'', msg:''}}
          onSubmit={(values)=>{
            postData('http://localhost:3000', values);
          }}>
            <Form className="bg-slate-800 bg-opacity-10 border-2 rounded-2xl flex flex-col mx-5 sm:mx-20 xl:mx-96 mb-20">
              <label htmlFor="email" className={[element, label].join(' ')}>Email</label>
              <Field type="text" name="email" className={[element, field].join(' ')}/>
              <label htmlFor="password" className={[element, label].join(' ')}>Password</label>
              <Field type="password" name="password" className={[element, field].join(' ')}/>
              <label htmlFor="url" className={[element, label].join(' ')}>Url</label>
              <Field type="text" name="url" className={[element, field].join(' ')}/>
              <label htmlFor="msg" className={[element, label].join(' ')}>Message</label>
              <Field type="text" name="msg" component="textarea" className={textArea} />
              <button type="submit" className={[element, button].join(' ')}>Submit</button>
            </Form>
          </Formik>
        </div>
    </div>
  );
}

export default App;
