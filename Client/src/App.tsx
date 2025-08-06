import axios from 'axios';
import { Button } from './components/ui/button'

function App() {

  async function fetchAppStatus() {
    try {
      const response = await axios.get('http://localhost:5000/getApp');
      console.log(response);
    } catch (error) {
      console.error('Error fetching app status:', error);
    }
  }

  return (
    <>
      <Button onClick={fetchAppStatus}>Click</Button>
    </>
  )
}

export default App
