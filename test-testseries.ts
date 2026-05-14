import axios from 'axios';
import { performLogin, fetchApi } from './lib/aggregator';

async function test() {
  const result = await performLogin('6260590329', 'Rahul@123');
  console.log('Login result:', result);
  if (result) {
    try {
      const data = await fetchApi("/get/test_seriesbycourseid", { courseid: 247, folder_wise_course: 0, start: -1 });
      console.log('Tests:', data);
    } catch (e: any) {
      console.error(e.response?.data);
    }
  }
}

test();
