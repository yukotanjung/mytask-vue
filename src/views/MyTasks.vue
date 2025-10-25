
<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">My Tasks</h3>
    </div>
    <div class="card-body">
      <button
        v-if="can('task_create')"
        class="btn btn-sm btn-primary mb-3"
        data-bs-toggle="modal"
        data-bs-target="#taskModal"
      >
        <i class="fas fa-plus"></i> Add Task
      </button>
      <table id="myTasksTable" class="table table-bordered table-striped mt-2">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        
      </table>
    </div>
    <div
  class="modal fade"
  id="taskModal"
  tabindex="-1"
  aria-labelledby="taskModalLabel"
  aria-hidden="true"
>
  <div class="modal-dialog">
    <div class="modal-content">
      <form @submit.prevent="saveTask">
        <div class="modal-header">
          <h5 class="modal-title" id="taskModalLabel">
            {{ isEdit ? 'Edit Task' : 'Add New Task' }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="form-group mb-3">
            <label>Task Name</label>
            <input
              v-model="form.title"
              type="text"
              class="form-control"
              required
            />
          </div>
          <div class="form-group mb-3">
            <label>Description</label>
            <textarea
              v-model="form.description"
              class="form-control"
              rows="3"
              required
            ></textarea>
          </div>
          <div class="form-group mb-3">
            <label>Status</label>
            <select v-model="form.status" class="form-control" required>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div class="form-group mb-3">
            <label>Due Date</label>
            <input
              v-model="form.due_date"
              type="date"
              class="form-control"
              required
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            {{ isEdit ? 'Update' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import $ from 'jquery'
import 'datatables.net-bs4'

import { useAuth } from '../composables/useAuth'
import api from '@/api'
import * as bootstrap from 'bootstrap'
import Swal from 'sweetalert2'




const { can } = useAuth()

const form = ref({
  title: '',
  description: '',
  status: 'todo',
  due_date: ''
})


const isEdit = ref(false)
let editId = null


onMounted(() => {
  initServerSideTable()
})

function initServerSideTable() {
  
  if ($.fn.DataTable.isDataTable('#myTasksTable')) {
    $('#myTasksTable').DataTable().destroy()
  }

  $('#myTasksTable').DataTable({
    processing: true,
    serverSide: true,
    responsive: true,
    autoWidth: false,
    order: [[6, 'desc']],
    ajax: function (data, callback) {
      const token = localStorage.getItem('token')
      const page = Math.floor(data.start / data.length) + 1
      const sortColumnIndex = data.order[0]?.column ?? 6
      const sortColumnName = data.columns[sortColumnIndex]?.data ?? 'created_at'
      const sortDir = data.order[0]?.dir ?? 'desc'
      const searchValue = data.search?.value ?? ''

      $.ajax({
        url: process.env.VUE_APP_API_BASE_URL + 'tasks',
        type: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        dataType: 'json',
         data: {
          page: page,
          sort: sortColumnName,
          order: sortDir,
          search: searchValue,
          per_page: data.length
        },
        success: function (res) {
          if (res.success && res.data) {
            const meta = res.data.meta
            const tasks = res.data.data

            callback({
              draw: data.draw,
              recordsTotal: meta.total,
              recordsFiltered: meta.total,
              data: tasks
            })
          } else {
            callback({ draw: data.draw, recordsTotal: 0, recordsFiltered: 0, data: [] })
          }
        },
        error: function (xhr) {
          console.error('Error:', xhr)
          callback({ draw: data.draw, recordsTotal: 0, recordsFiltered: 0, data: [] })
        }
      })
    },
    columns: [
      { data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1 + meta.settings._iDisplayStart
        },
        orderable: false
      },
      { data: 'title' },
      { data: 'description' },
      {
        data: 'status',
        render: data => {
          const badge =
            data === 'done'
              ? 'badge bg-success'
              : data === 'in-progress'
              ? 'badge bg-warning text-dark'
              : 'badge bg-secondary'
          return `<span class="${badge}">${data}</span>`
        }
      },
      {
        data: 'due_date',
        render: data => {
          const d = new Date(data)
          return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
        }
      },
      {
        data: null,
        orderable: false,
        render: row => {
          let btnEdit = ''
          let btnDelete = ''
          const allowEdit = can('task_update')
          const allowDelete = can('task_delete')
          if (allowEdit){
            btnEdit = `<button class="btn btn-sm btn-warning me-1 edit-task" data-id="${row.id}">
                <i class="fas fa-edit"></i>
              </button>`
          }

          if(allowDelete){
            btnDelete = `
                <button class="btn btn-sm btn-danger delete-task" data-id="${row.id}">
                  <i class="fas fa-trash"></i>
                </button>
              `
          }
          return btnEdit + btnDelete
        }
      },
      { data: 'created_at', visible: false }

    ],
    language: {
      search: '',
      searchPlaceholder: 'Search...',
      lengthMenu: '_MENU_',
      
    }
  })

  $('#myTasksTable').on('click', '.delete-task', function () {
    const id = $(this).data('id')
    confirmDeleteTask(id)
  })

    $('#myTasksTable').on('click', '.edit-task', function () {
    const id = $(this).data('id')
    openEditModal(id)
  })

}

async function confirmDeleteTask(id) {
  const token = localStorage.getItem('token')

  Swal.fire({
    title: 'Are you sure?',
    text: 'Data will be permanently deleted!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, remove it!',
    cancelButtonText: 'Cancel'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await api.delete(`/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (res.data.success) {
          
          $('#myTasksTable').DataTable().ajax.reload(null, false)

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Task deleted successfully!',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: 'Failed to delete task.'
          })
        }
      } catch (err) {
        console.error('Delete error:', err)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong. Please try again later'
        })
      }
    }
  })
}

async function openEditModal(id) {
  const token = localStorage.getItem('token')

  try {
    const res = await api.get(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (res.data.success) {
      const task = res.data.data
      form.value = {
        title: task.title,
        description: task.description,
        status: task.status,
        due_date: task.due_date.split('T')[0]
      }
      editId = id
      isEdit.value = true

      const modalEl = document.getElementById('taskModal')
      const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl)
      modal.show()
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: 'Data not found.'
      })
    }
  } catch (err) {
    console.error('Error fetching task:', err)
  }
}

async function saveTask() {
  const token = localStorage.getItem('token')
  try {
    let res
    if (isEdit.value) {
      // Update task
      res = await api.put(`/tasks/${editId}`, form.value, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } else {
      // Create new task
      res = await api.post('/tasks', form.value, {
        headers: { Authorization: `Bearer ${token}` }
      })
    }

    if (res.data.success) {
      const modalEl = document.getElementById('taskModal')
      const modal = bootstrap.Modal.getInstance(modalEl)
      if (modal) modal.hide()
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove())

    
      form.value = { title: '', description: '', status: 'todo', due_date: '' }
      isEdit.value = false
      editId = null

      
      $('#myTasksTable').DataTable().ajax.reload(null, false)

      
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: isEdit.value ? 'Task updated successfully!' : 'Task created successfully!',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      })
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Failed!',
        text: 'Failed to save task.'
      })
    }
  } catch (err) {
    console.error('Save error:', err)
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong. Please try again later.'
    })
  }
}



</script>


