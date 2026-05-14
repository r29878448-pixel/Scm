import axios from 'axios';
import { fetchApi } from './lib/aggregator';

async function test() {
  try {
    const data = await fetchApi("/get/test_titlev2", { testseriesid: 94, subject_id: -1, start: -1, search: '', courseid: 247 });
    console.log('Test Titles:', data);
  } catch (e: any) {
    console.error(e.response?.data);
  }
}

test();
