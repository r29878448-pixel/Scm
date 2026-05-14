const BASE_URL = '/api';

export async function fetchMyBatches() {
  const res = await fetch(`${BASE_URL}/my-batches`);
  return res.json();
}

export async function fetchSubjects(courseId: string) {
  const res = await fetch(`${BASE_URL}/subjects?courseid=${courseId}`);
  return res.json();
}

export async function fetchTopics(courseId: string, subjectId: string) {
  const res = await fetch(`${BASE_URL}/topics?courseid=${courseId}&subjectid=${subjectId}`);
  return res.json();
}

export async function fetchVideos(courseId: string, subjectId: string, topicId: string) {
  const res = await fetch(`${BASE_URL}/videos?courseid=${courseId}&subjectid=${subjectId}&topicid=${topicId}`);
  return res.json();
}

export async function fetchLiveLectures(courseId: string, subjectId: string) {
  const res = await fetch(`${BASE_URL}/live-lectures?courseid=${courseId}&subjectid=${subjectId}`);
  return res.json();
}

export async function fetchPreviousLiveVideos(courseId: string) {
  const res = await fetch(`${BASE_URL}/previous-live?course_id=${courseId}`);
  return res.json();
}

export async function fetchTestSeries(courseId: string) {
  const res = await fetch(`${BASE_URL}/test-series?courseid=${courseId}`);
  return res.json();
}

export async function fetchVideoDetails(courseId: string, videoId: string) {
  const res = await fetch(`${BASE_URL}/video-details?courseid=${courseId}&videoid=${videoId}`);
  return res.json();
}

export async function fetchPurchasedTestSeries() {
  const res = await fetch(`${BASE_URL}/purchased-test-series?userid=533219`);
  return res.json();
}
