// Local Database Layer - Offline Alternative to Supabase Database
// This provides a complete database system using localStorage

import { Student } from '@/types/student';

const STORAGE_KEYS = {
  STUDENTS: 'qrgrad_students',
  SECTIONS: 'qrgrad_sections',
  WALKED_STUDENTS: 'qrgrad_walked_students',
  CEREMONY_STATE: 'qrgrad_ceremony_state',
};

export interface LocalSection {
  id: string;
  name: string;
  order: number;
}

export interface CeremonyState {
  isActive: boolean;
  currentStudentId: string | null;
  lastUpdated: string;
}

// Initialize with sample data if empty
const initializeDefaultData = () => {
  const students = getStudents();
  
  if (students.length === 0) {
    // Add some sample students
    const sampleStudents: Student[] = [
      {
        id: '1',
        name: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        section: 'Section A',
        awards: ['Summa Cum Laude', 'Computer Science'],
        photo: '',
        qrCode: 'QR001',
        hasWalked: false,
        createdAt: new Date(),
      },
      {
        id: '2',
        name: 'Jane Smith',
        firstName: 'Jane',
        lastName: 'Smith',
        section: 'Section A',
        awards: ['Magna Cum Laude', 'Information Technology'],
        photo: '',
        qrCode: 'QR002',
        hasWalked: false,
        createdAt: new Date(),
      },
      {
        id: '3',
        name: 'Michael Johnson',
        firstName: 'Michael',
        lastName: 'Johnson',
        section: 'Section B',
        awards: ['Cum Laude', 'Computer Engineering'],
        photo: '',
        qrCode: 'QR003',
        hasWalked: false,
        createdAt: new Date(),
      },
    ];
    
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(sampleStudents));
    console.log('Sample students initialized');
  }
  
  const sections = getSections();
  if (sections.length === 0) {
    const defaultSections: LocalSection[] = [
      { id: '1', name: 'Section A', order: 1 },
      { id: '2', name: 'Section B', order: 2 },
    ];
    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(defaultSections));
  }
};

// Students
export const getStudents = (): Student[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  return stored ? JSON.parse(stored) : [];
};

export const getStudentById = (id: string): Student | null => {
  const students = getStudents();
  return students.find(s => s.id === id) || null;
};

export const getStudentByQRCode = (qrCode: string): Student | null => {
  const students = getStudents();
  return students.find(s => s.qrCode === qrCode) || null;
};

export const addStudent = (student: Omit<Student, 'id'>): Student => {
  const students = getStudents();
  const newStudent: Student = {
    ...student,
    id: 'student-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
  };
  students.push(newStudent);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  return newStudent;
};

export const updateStudent = (id: string, updates: Partial<Student>): Student | null => {
  const students = getStudents();
  const index = students.findIndex(s => s.id === id);
  
  if (index === -1) return null;
  
  students[index] = { ...students[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  return students[index];
};

export const deleteStudent = (id: string): boolean => {
  const students = getStudents();
  const filtered = students.filter(s => s.id !== id);
  
  if (filtered.length === students.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(filtered));
  return true;
};

export const markStudentAsWalked = (id: string): Student | null => {
  const student = updateStudent(id, { hasWalked: true });
  
  if (student) {
    // Add to walked log
    const walkedStudents = getWalkedStudents();
    walkedStudents.push({
      studentId: id,
      studentName: student.name,
      walkedAt: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.WALKED_STUDENTS, JSON.stringify(walkedStudents));
  }
  
  return student;
};

// Sections
export const getSections = (): LocalSection[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.SECTIONS);
  return stored ? JSON.parse(stored) : [];
};

export const addSection = (name: string): LocalSection => {
  const sections = getSections();
  const newSection: LocalSection = {
    id: 'section-' + Date.now(),
    name,
    order: sections.length + 1,
  };
  sections.push(newSection);
  localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
  return newSection;
};

export const updateSection = (id: string, name: string): LocalSection | null => {
  const sections = getSections();
  const index = sections.findIndex(s => s.id === id);
  
  if (index === -1) return null;
  
  sections[index].name = name;
  localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
  return sections[index];
};

export const deleteSection = (id: string): boolean => {
  const sections = getSections();
  const filtered = sections.filter(s => s.id !== id);
  
  if (filtered.length === sections.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(filtered));
  return true;
};

export const reorderSections = (sections: LocalSection[]): void => {
  const reordered = sections.map((s, index) => ({ ...s, order: index + 1 }));
  localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(reordered));
};

// Walked Students Log
export interface WalkedStudentLog {
  studentId: string;
  studentName: string;
  walkedAt: string;
}

export const getWalkedStudents = (): WalkedStudentLog[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.WALKED_STUDENTS);
  return stored ? JSON.parse(stored) : [];
};

export const clearWalkedLog = (): void => {
  localStorage.setItem(STORAGE_KEYS.WALKED_STUDENTS, JSON.stringify([]));
};

// Ceremony State
export const getCeremonyState = (): CeremonyState => {
  const stored = localStorage.getItem(STORAGE_KEYS.CEREMONY_STATE);
  return stored ? JSON.parse(stored) : {
    isActive: false,
    currentStudentId: null,
    lastUpdated: new Date().toISOString(),
  };
};

export const updateCeremonyState = (updates: Partial<CeremonyState>): CeremonyState => {
  const state = getCeremonyState();
  const newState = {
    ...state,
    ...updates,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.CEREMONY_STATE, JSON.stringify(newState));
  return newState;
};

export const setCurrentStudent = (studentId: string | null): CeremonyState => {
  return updateCeremonyState({ currentStudentId: studentId });
};

export const startCeremony = (): CeremonyState => {
  return updateCeremonyState({ isActive: true });
};

export const stopCeremony = (): CeremonyState => {
  return updateCeremonyState({ isActive: false, currentStudentId: null });
};

// Reset all data (for testing)
export const resetAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.SECTIONS);
  localStorage.removeItem(STORAGE_KEYS.WALKED_STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.CEREMONY_STATE);
  initializeDefaultData();
};

// Initialize on module load
initializeDefaultData();
