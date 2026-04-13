<template>
  <Modal :isOpen="isOpen" @close="$emit('close')">
    <div v-if="file">
      <div class="flex justify-between items-start mb-6">
         <div>
            <h3 class="text-2xl font-serif font-bold text-primary-dark mb-1">{{ file.name }}</h3>
            <p class="text-[10px] uppercase tracking-widest font-bold text-text-muted">Uploaded {{ file.date }}</p>
         </div>
      </div>
      
      <div class="bg-gray-100 rounded-3xl w-full h-[360px] flex items-center justify-center overflow-hidden mb-6 relative group border border-gray-200">
        <img v-if="file.type === 'image'" :src="file.url" class="w-full h-full object-cover" />
        <div v-else class="text-center">
           <DocumentIcon class="w-16 h-16 text-gray-300 mx-auto mb-3" />
           <p class="font-bold text-gray-400 text-sm tracking-wide">PDF Document Data</p>
        </div>
        
        <!-- Controls overlay -->
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg flex gap-6 opacity-0 group-hover:opacity-100 transition-opacity border border-white">
           <button class="text-text-muted hover:text-accent-green transition-colors"><MagnifyingGlassPlusIcon class="w-5 h-5" /></button>
           <button class="text-text-muted hover:text-accent-green transition-colors"><DocumentMagnifyingGlassIcon class="w-5 h-5" /></button>
           <button class="text-text-muted hover:text-accent-green transition-colors"><ArrowDownTrayIcon class="w-5 h-5" /></button>
        </div>
      </div>
      
      <div class="mb-8">
         <p class="text-[9px] uppercase tracking-widest font-bold text-text-muted mb-2">Classified Tags</p>
         <div class="flex flex-wrap gap-2">
           <span class="px-4 py-1.5 bg-primary-soft text-primary-dark text-xs font-bold uppercase tracking-wider rounded-md border border-primary-soft hover:border-primary-dark/20 cursor-pointer transition-colors" v-for="tag in file.tags" :key="tag">
             {{ tag }}
           </span>
         </div>
      </div>
      
      <div class="flex gap-4">
         <Button block>Verify & Lock to Timeline</Button>
      </div>
    </div>
  </Modal>
</template>
<script setup>
import Modal from './Modal.vue'
import Button from './Button.vue'
import { DocumentIcon, MagnifyingGlassPlusIcon, ArrowDownTrayIcon, DocumentMagnifyingGlassIcon } from '@heroicons/vue/24/outline'

defineProps({
  isOpen: Boolean,
  file: Object
})
defineEmits(['close'])
</script>
