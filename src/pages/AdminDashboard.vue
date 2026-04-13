<template>
  <div>
    <h1 class="text-3xl font-serif font-bold text-brand-dark mb-1">Doctor Approvals</h1>
    <p class="text-text-mid text-sm mb-6">Review and manage registrations</p>

    <div class="space-y-3">
      <Card v-for="doc in doctors" :key="doc.id" class="!p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-brand-dark text-white flex items-center justify-center font-bold text-sm shadow-icon">
              {{ doc.name.split(' ').map(n => n[0]).join('') }}
            </div>
            <div>
              <h4 class="text-sm font-bold text-brand-dark">{{ doc.name }}</h4>
              <p class="text-xs text-text-mid">{{ doc.specialty }} · {{ doc.id }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg"
              :class="{
                'bg-warn/15 text-warn': doc.status === 'Pending',
                'bg-brand-green/10 text-brand-green': doc.status === 'Approved',
                'bg-danger/10 text-danger': doc.status === 'Rejected',
              }">{{ doc.status }}</span>
            <template v-if="doc.status === 'Pending'">
              <Button variant="success" class="!text-xs !px-3 !py-1.5" @click="doc.status = 'Approved'">Approve</Button>
              <Button variant="danger" class="!text-xs !px-3 !py-1.5" @click="doc.status = 'Rejected'">Reject</Button>
            </template>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Card from '../components/Card.vue'
import Button from '../components/Button.vue'
const doctors = ref([
  { id: 'MD-84920', name: 'Dr. Sarah Connor', specialty: 'Neurology', status: 'Pending' },
  { id: 'MD-11234', name: 'Dr. James Wilson', specialty: 'Oncology', status: 'Pending' },
  { id: 'MD-55821', name: 'Dr. Allison Cameron', specialty: 'Immunology', status: 'Pending' },
  { id: 'MD-99120', name: 'Dr. Robert Chase', specialty: 'Surgery', status: 'Approved' },
  { id: 'MD-33012', name: 'Dr. Lisa Cuddy', specialty: 'Endocrinology', status: 'Rejected' },
])
</script>
