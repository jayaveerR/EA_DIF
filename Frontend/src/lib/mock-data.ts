
export interface TimelineItem {
  date: string;
  event: string;
  type: 'Warning' | 'Anomaly' | 'Normal';
}

export interface ShapInsight {
  feature: string;
  value: number;
  label: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  risk: number;
  status: 'High' | 'Medium' | 'Low';
  major: string;
  year: string;
  gpa: number;
  attendance: string;
  summary: string;
  timeline: TimelineItem[];
  insights: {
    coreReason: string;
    recommendation: string;
    shap: ShapInsight[];
  };
}

export interface Alert {
  id: string;
  name: string;
  score: number;
  status: 'High' | 'Medium';
  reason: string;
  time: string;
  email: string;
}

export const SYSTEM_STATS = {
  activeStudents: 1248,
  riskAlerts: 14,
  avgAccuracy: 98.4,
  avgRisk: 42.5,
  trends: {
    students: '+12% from last month',
    alerts: '+5 new today',
    accuracy: 'Stable',
    risk: '-2.1% improvement'
  }
};

export const MOCK_STUDENTS: Student[] = [
  { 
    id: 'S-7729', 
    name: 'Alex Rivera', 
    email: 'arivera@uni.edu', 
    phone: '+1 415 555 0122', 
    address: 'Faculty Residence B-12', 
    risk: 92, 
    status: 'High', 
    major: 'Applied Physics', 
    year: 'Senior',
    gpa: 3.42,
    attendance: '91%',
    summary: 'Alex is currently in their final year. Recent data indicates a significant deviation in late-night submission patterns, impacting session-level consistency markers.',
    timeline: [
      { date: 'Today, 10:24 AM', event: 'Unusual high frequency of AI code assistant queries', type: 'Warning' },
      { date: 'Yesterday', event: 'Late submission for "Quantum Mechanics II"', type: 'Anomaly' },
      { date: 'Oct 15, 2026', event: 'Participated in physics lab session', type: 'Normal' },
      { date: 'Oct 12, 2026', event: 'Multiple failed VPN login attempts from unrecognized IP', type: 'Anomaly' },
    ],
    insights: {
      coreReason: 'Temporal drift in study habits combined with infrastructure access anomalies.',
      recommendation: 'Immediate behavioral review with department head.',
      shap: [
        { feature: 'Submission Latency', value: -85, label: 'Critical Shift' },
        { feature: 'Access Regularity', value: -62, label: 'Highly Irregular' },
        { feature: 'Peer Interaction', value: +12, label: 'Stable' },
      ]
    }
  },
  { 
    id: 'S-3310', 
    name: 'Elena Vance', 
    email: 'evance@uni.edu', 
    phone: '+1 415 555 0199', 
    address: 'East Hall 402', 
    risk: 78, 
    status: 'Medium', 
    major: 'Software Architecture', 
    year: 'Junior',
    gpa: 3.89,
    attendance: '97%',
    summary: 'Elena maintains an excellent academic record. The system flag originates from a localized drop in collaborative platform engagement over the last two weeks.',
    timeline: [
      { date: '2h ago', event: 'Zero activity on collaborative IDE for 48 hours', type: 'Warning' },
      { date: 'Last Week', event: 'Perfect score on Middleware design quiz', type: 'Normal' },
      { date: 'Oct 14, 2026', event: 'Missing mandatory peer review session', type: 'Anomaly' },
    ],
    insights: {
      coreReason: 'Sudden isolation in collaborative software development workflows.',
      recommendation: 'Check-in regarding group project pressures.',
      shap: [
        { feature: 'Group Engagement', value: -70, label: 'Sharp Decline' },
        { feature: 'Academic Score', value: +95, label: 'Exceptional' },
        { feature: 'Resource Download', value: -20, label: 'Minor Drop' },
      ]
    }
  },
  { 
    id: 'S-9092', 
    name: 'Marcus Thorne', 
    email: 'mthorne@uni.edu', 
    phone: '+1 415 555 0182', 
    address: 'West Dorm #22', 
    risk: 85, 
    status: 'High', 
    major: 'Quantum Computing', 
    year: 'Graduate',
    gpa: 3.12,
    attendance: '85%',
    summary: 'As a Graduate student, Marcus has previously shown high engagement. Current flags suggest academic fatigue mirrored in platform interaction velocity.',
    timeline: [
      { date: 'Yesterday', event: 'Abrupt session termination during research data entry', type: 'Anomaly' },
      { date: '3 days ago', event: 'Sub-optimal performance in simulated env test', type: 'Warning' },
    ],
    insights: {
      coreReason: 'High correlation between session fatigue and data entry error rates.',
      recommendation: 'Discuss research workload and potential sabbatical phases.',
      shap: [
        { feature: 'Interaction Velocity', value: -88, label: 'Significant Slump' },
        { feature: 'Data Accuracy', value: -45, label: 'Declining' },
        { feature: 'Library Catalog Use', value: +5, label: 'Normal' },
      ]
    }
  },
  { 
    id: 'S-1124', 
    name: 'Zoe Kaelin', 
    email: 'zkaelin@uni.edu', 
    phone: '+1 415 555 0144', 
    address: 'Off-campus Housing 4', 
    risk: 65, 
    status: 'Medium', 
    major: 'Bioinformatics', 
    year: 'Freshman',
    gpa: 3.98,
    attendance: '100%',
    summary: 'Zoe is a top-performing freshman. A slight behavioral variance was detected in LMS access times, though grades remain unimpaired.',
    timeline: [
      { date: 'Oct 18', event: 'Shift from morning to nocturnal platform use detected', type: 'Warning' },
      { date: 'Oct 15', event: 'Full marks on Biology Midterm', type: 'Normal' },
    ],
    insights: {
      coreReason: 'Circadian rhythm shift in study patterns without academic loss.',
      recommendation: 'Monitor for secondary health impact signs.',
      shap: [
        { feature: 'Temporal Regularity', value: -40, label: 'Moderate Drift' },
        { feature: 'Final Grade Pct', value: +98, label: 'Maximum' },
      ]
    }
  },
];

export const MOCK_ALERTS: Alert[] = MOCK_STUDENTS.map(s => ({
  id: s.id,
  name: s.name,
  score: s.risk,
  status: s.status === 'High' ? 'High' : 'Medium',
  reason: s.risk > 85 
    ? 'Unusual late-night activity + drop in attendance' 
    : 'Sudden decrease in assignment submission rate',
  time: '2h ago',
  email: s.email
}));

export const WEEKLY_ANOMALIES = [
  { name: 'Mon', anomalies: 4 },
  { name: 'Tue', anomalies: 7 },
  { name: 'Wed', anomalies: 3 },
  { name: 'Thu', anomalies: 9 },
  { name: 'Fri', anomalies: 5 },
  { name: 'Sat', anomalies: 2 },
  { name: 'Sun', anomalies: 1 },
];

export const RISK_DISTRIBUTION = [
  { name: 'High Risk', value: 12, color: '#EF4444' },
  { name: 'Medium Risk', value: 25, color: '#F59E0B' },
  { name: 'Low Risk', value: 63, color: '#10B981' },
];

export const PERFORMANCE_METRICS = [
  { subject: 'Accuracy', A: 98.4, fullMark: 100 },
  { subject: 'Precision', A: 96.2, fullMark: 100 },
  { subject: 'Recall', A: 94.8, fullMark: 100 },
  { subject: 'F1 Score', A: 95.5, fullMark: 100 },
  { subject: 'AUC-ROC', A: 97.1, fullMark: 100 },
];

export const DRIFT_HISTORY = [
  { name: 'Jan', accuracy: 98.2, drift: 0.1 },
  { name: 'Feb', accuracy: 98.5, drift: 0.2 },
  { name: 'Mar', accuracy: 97.8, drift: 0.5 },
  { name: 'Apr', accuracy: 97.2, drift: 0.9 },
  { name: 'May', accuracy: 96.5, drift: 1.4 },
  { name: 'Jun', accuracy: 98.4, drift: 0.3 },
];
