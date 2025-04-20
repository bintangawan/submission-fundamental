// Saya membuat stylenya di dalam const pada main.js karena shadowroot pada webpack,
// tidak bisa mengkases file cssnya kalau di dalam main.js, makanya saya jadikan const.

const style = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

:host {
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}

.card {
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-bottom: 16px;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

h3 {
  margin: 0 0 10px;
  font-size: 1.2rem;
  color: #1d4ed8;
}
p {
  color: #374151;
  font-size: 0.95rem;
  margin-bottom: 12px;
}
.note-id {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 10px;
}

.button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
button {
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.2s ease;
}
.archive-button {
  background-color: #f59e0b;
  color: white;
}
.archive-button:hover {
  background-color: #d97706;
}
.unarchive-button {
  background-color: #3b82f6;
  color: white;
}
.unarchive-button:hover {
  background-color: #2563eb;
}
.delete-button {
  background-color: #ef4444;
  color: white;
}
.delete-button:hover {
  background-color: #dc2626;
}

.form-container {
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}
input,
textarea {
  width: 100%;
  padding: 12px;
  margin-top: 6px;
  margin-bottom: 12px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
}
input:focus,
textarea:focus {
  outline: none;
  border-color: #3b82f6;
}
.submit-button {
  background: #10b981;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  font-weight: 600;
}
.submit-button:hover {
  background: #059669;
}

.spinner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}
.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

footer {
  background-color: #f3f4f6;
  color: #6b7280;
  text-align: center;
  padding: 1rem;
  font-size: 0.85rem;
  margin-top: 2rem;
  border-top: 1px solid #e5e7eb;
}
`;

const baseUrl = 'https://notes-api.dicoding.dev/v2/';

class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<header>Notes App - Submission Akhir</header>`;
  }
}
customElements.define('app-header', AppHeader);

class AppFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <footer>
        &copy; ${new Date().getFullYear()} Submission Akhir Dicoding. Dibuat dengan Sabar dan Cinta oleh Bintang.
      </footer>
    `;
  }
}
customElements.define('app-footer', AppFooter);

class NoteCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <div class="card">
        <h3></h3>
        <span class="note-id" style="font-size: 0.8em; color: gray;"></span>
        <p></p>
        <div class="button-group">
          <button class="archive-button">Arsipkan</button>
          <button class="unarchive-button">Kembalikan</button>
          <button class="delete-button">Hapus</button>
        </div>
        <div class="spinner-overlay" id="card-spinner" style="display:none">
          <div class="loading-spinner"></div>
        </div>
      </div>
    `;
  }

  async connectedCallback() {
    const id = this.getAttribute('note-id');
    const title = this.getAttribute('title');
    const body = this.getAttribute('body');
    const archived = this.getAttribute('archived') === 'true';

    this.shadowRoot.querySelector('h3').innerText = title;
    this.shadowRoot.querySelector('p').innerText = body;
    this.shadowRoot.querySelector('.note-id').innerText = `ID: ${id}`;

    const archiveBtn = this.shadowRoot.querySelector('.archive-button');
    const unarchiveBtn = this.shadowRoot.querySelector('.unarchive-button');
    const deleteBtn = this.shadowRoot.querySelector('.delete-button');
    const spinner = this.shadowRoot.getElementById('card-spinner');

    archiveBtn.style.display = archived ? 'none' : 'inline-block';
    unarchiveBtn.style.display = archived ? 'inline-block' : 'none';

    archiveBtn.addEventListener('click', async () => {
      spinner.style.display = 'flex';
      await fetch(`${baseUrl}notes/${id}/archive`, { method: 'POST' });
      setTimeout(() => {
        this.setAttribute('archived', 'true');
        archiveBtn.style.display = 'none';
        unarchiveBtn.style.display = 'inline-block';
        document.getElementById('archieved-container').appendChild(this);
        spinner.style.display = 'none';
        Swal.fire('Catatan Diarsipkan', 'Catatan berhasil dipindahkan ke arsip.', 'success');
      }, 500);
    });

    unarchiveBtn.addEventListener('click', async () => {
      spinner.style.display = 'flex';
      await fetch(`${baseUrl}notes/${id}/unarchive`, { method: 'POST' });
      setTimeout(() => {
        this.setAttribute('archived', 'false');
        archiveBtn.style.display = 'inline-block';
        unarchiveBtn.style.display = 'none';
        document.getElementById('notes-container').appendChild(this);
        spinner.style.display = 'none';
        Swal.fire('Catatan Dikembalikan', 'Catatan berhasil dipindahkan kembali.', 'success');
      }, 500);
    });

    deleteBtn.addEventListener('click', async () => {
      const confirmed = await Swal.fire({
        title: 'Yakin ingin menghapus?',
        text: 'Tindakan ini tidak bisa dibatalkan.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal',
      });

      if (confirmed.isConfirmed) {
        spinner.style.display = 'flex';
        await fetch(`${baseUrl}notes/${id}`, { method: 'DELETE' });
        setTimeout(() => {
          this.remove();
          spinner.style.display = 'none';
          Swal.fire('Terhapus!', 'Catatan berhasil dihapus.', 'success');
        }, 500);
      }
    });
  }
}
customElements.define('note-card', NoteCard);

class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <div class="form-container">
        <h2>Tambah Catatan</h2>
        <div class="spinner-overlay" id="form-spinner" style="display:none">
          <div class="loading-spinner"></div>
        </div>

        <form id="note-form">
          <label for="title">Judul</label>
          <input type="text" id="title" required minlength="3" />
          <small class="error-message"></small>

          <label for="body">Isi Catatan</label>
          <textarea id="body" required minlength="5"></textarea>
          <small class="error-message"></small>

          <button type="submit" class="submit-button">Tambah Catatan</button>
        </form>
      </div>
    `;
  }

  async connectedCallback() {
    this.shadowRoot.querySelector('form').addEventListener('submit', async event => {
      event.preventDefault();

      const titleInput = this.shadowRoot.querySelector('#title');
      const bodyInput = this.shadowRoot.querySelector('#body');
      const spinner = this.shadowRoot.getElementById('form-spinner');

      if (titleInput.value.length < 3 || bodyInput.value.length < 5) return;

      spinner.style.display = 'flex';

      try {
        const response = await fetch(`${baseUrl}notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: titleInput.value,
            body: bodyInput.value,
          }),
        });

        const result = await response.json();

        if (result.status === 'success') {
          const note = result.data;
          const newNote = document.createElement('note-card');
          newNote.setAttribute('note-id', note.id);
          newNote.setAttribute('title', note.title);
          newNote.setAttribute('body', note.body);
          newNote.setAttribute('archived', note.archived);

          document.getElementById('notes-container').appendChild(newNote);
          currentNoteIds.add(note.id);

          Swal.fire('Berhasil!', 'Catatan baru berhasil ditambahkan.', 'success');
        }

        setTimeout(() => {
          spinner.style.display = 'none';
          titleInput.value = '';
          bodyInput.value = '';
        }, 500);
      } catch (err) {
        console.error('Gagal submit:', err);
        spinner.style.display = 'none';
      }
    });
  }
}
customElements.define('note-form', NoteForm);

let currentNoteIds = new Set();

async function fetchNotes() {
  try {
    const notesContainer = document.getElementById('notes-container');
    const archiveContainer = document.getElementById('archieved-container');

    const responseNotes = await fetch(`${baseUrl}notes`);
    const resultNotes = await responseNotes.json();

    if (resultNotes.status === 'success') {
      resultNotes.data.forEach(note => {
        if (!currentNoteIds.has(note.id)) {
          const noteElement = document.createElement('note-card');
          noteElement.setAttribute('note-id', note.id);
          noteElement.setAttribute('title', note.title);
          noteElement.setAttribute('body', note.body);
          noteElement.setAttribute('archived', note.archived);
          notesContainer.appendChild(noteElement);
          currentNoteIds.add(note.id);
        }
      });
    }

    const responseArchived = await fetch(`${baseUrl}notes/archived`);
    const resultArchived = await responseArchived.json();

    if (resultArchived.status === 'success') {
      resultArchived.data.forEach(note => {
        if (!currentNoteIds.has(note.id)) {
          const noteElement = document.createElement('note-card');
          noteElement.setAttribute('note-id', note.id);
          noteElement.setAttribute('title', note.title);
          noteElement.setAttribute('body', note.body);
          noteElement.setAttribute('archived', note.archived);
          archiveContainer.appendChild(noteElement);
          currentNoteIds.add(note.id);
        }
      });
    }
  } catch (error) {
    console.error('Gagal memuat data catatan:', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await fetchNotes();
  setInterval(fetchNotes, 5000);
});
