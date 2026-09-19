'use strict';

/*
Entry template — copy this object into the papers array for each paper.
Use an ISO date (YYYY-MM-DD); entries are displayed newest first.

{
  dateRead: 'YYYY-MM-DD',
  domain: 'Research domain',
  title: 'Paper title',
  authors: ['Author One', 'Author Two'],
  venue: 'Venue · Year',
  url: 'https://example.com/paper',
  researchQuestion: 'What question does the paper investigate?',
  methodology: 'What architecture or methodology does it use?',
  learned: 'What did I learn from it?',
  perspective: 'What is my perspective on the work?'
}
*/
const papers = [];

const paperList = document.getElementById('paper-list');
const emptyState = document.getElementById('empty-state');
const paperCount = document.getElementById('paper-count');
const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function addNote(list, label, text) {
  const group = document.createElement('div');
  group.append(makeElement('dt', '', label), makeElement('dd', '', text));
  list.append(group);
}

function renderPaper(paper) {
  const card = makeElement('article', 'paper-card');
  const header = makeElement('header', 'paper-header');
  const meta = makeElement('div', 'paper-meta');
  const date = makeElement('time', '', dateFormat.format(new Date(`${paper.dateRead}T00:00:00`)));
  date.dateTime = paper.dateRead;
  meta.append(date, makeElement('span', 'domain', paper.domain));

  const title = makeElement('h2', '', paper.title);
  const authors = makeElement('p', 'authors', paper.authors.join(' · '));
  const venue = makeElement('p', 'venue', paper.venue);
  const link = makeElement('a', 'paper-link', 'Read paper ↗');
  link.href = paper.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  header.append(meta, title, authors, venue, link);

  const notes = makeElement('dl', 'paper-notes');
  addNote(notes, 'Research question', paper.researchQuestion);
  addNote(notes, 'Architecture or methodology', paper.methodology);
  addNote(notes, 'What I learned', paper.learned);
  addNote(notes, 'My perspective', paper.perspective);
  card.append(header, notes);
  return card;
}

if (papers.length === 0) {
  emptyState.hidden = false;
  paperCount.textContent = '0 PAPER NOTES';
} else {
  const sortedPapers = [...papers].sort((a, b) => b.dateRead.localeCompare(a.dateRead));
  paperList.append(...sortedPapers.map(renderPaper));
  paperCount.textContent = `${papers.length} PAPER ${papers.length === 1 ? 'NOTE' : 'NOTES'}`;
}
