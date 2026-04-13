<template>
  <div
    class="border-2 border-dashed rounded-[32px] p-10 text-center transition-all bg-white relative overflow-hidden group shadow-sm hover:shadow-md"
    :class="[isDragging ? 'border-primary-dark bg-primary-soft/50' : 'border-gray-200 hover:border-accent-green/50']"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
  >
    <div class="absolute -right-8 -bottom-8 opacity-5 text-primary-dark group-hover:scale-110 transition-transform duration-700">
      <CloudArrowUpIcon class="w-48 h-48" />
    </div>
    
    <div class="relative z-10 flex flex-col items-center">
      <div class="w-16 h-16 rounded-full bg-off-white flex items-center justify-center mb-6 text-primary-dark shadow-inner border border-gray-100 group-hover:bg-primary-soft transition-colors">
        <ArrowUpTrayIcon class="w-8 h-8" />
      </div>
      <h3 class="text-2xl font-serif font-bold text-primary-dark mb-2">Secure Vault Upload</h3>
      <p class="text-text-muted text-sm mb-8 max-w-sm font-medium">Drag medical reports, test results, or diagnostic imagery into the secure zone.</p>
      
      <div class="flex gap-4">
        <label class="cursor-pointer block relative z-20">
          <Button variant="primary" as="span" class="pointer-events-none px-8">Browse Files</Button>
          <input type="file" class="hidden" @change="handleFileSelect" multiple accept=".pdf,image/*" />
        </label>
        <Button variant="secondary" @click="$emit('open-camera')" class="px-6 relative z-20">
          <CameraIcon class="w-5 h-5 mr-2" /> Camera
        </Button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { CloudArrowUpIcon, ArrowUpTrayIcon, CameraIcon } from '@heroicons/vue/24/outline'
import Button from './Button.vue'

const isDragging = ref(false)
const emit = defineEmits(['files-selected', 'open-camera'])

const handleDrop = (e) => {
  isDragging.value = false
  if (e.dataTransfer.files.length) {
    emit('files-selected', e.dataTransfer.files)
  }
}

const handleFileSelect = (e) => {
  if (e.target.files.length) {
    emit('files-selected', e.target.files)
  }
}
</script>
