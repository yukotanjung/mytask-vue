import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

window.$ = window.jQuery = $


import 'admin-lte/dist/css/adminlte.min.css'
import 'admin-lte/dist/js/adminlte.min.js'

import '@fortawesome/fontawesome-free/css/all.min.css'

import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css'
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css'



createApp(App).use(router).mount('#app')
