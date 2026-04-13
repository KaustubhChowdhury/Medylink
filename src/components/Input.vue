<template>
  <div class="w-full">
    <label v-if="label" class="block text-[11px] uppercase font-bold text-text-muted mb-2 tracking-wider">{{ label }}</label>
    <div class="relative">
      <input
        v-if="type !== 'textarea' && type !== 'select'"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="w-full bg-off-white/80 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green transition-all shadow-inner text-primary-dark font-medium"
        :placeholder="placeholder"
        v-bind="$attrs"
      />
      
      <textarea
        v-else-if="type === 'textarea'"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="w-full bg-off-white/80 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green transition-all resize-y min-h-[120px] shadow-inner text-primary-dark font-medium"
        :placeholder="placeholder"
        v-bind="$attrs"
      ></textarea>
      
      <div v-else-if="type === 'select'" class="relative">
        <select
          :value="modelValue"
          @change="$emit('update:modelValue', $event.target.value)"
          class="w-full bg-off-white/80 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green transition-all appearance-none shadow-inner text-primary-dark font-medium"
          v-bind="$attrs"
        >
          <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  options: { type: Array, default: () => [] }
})
defineEmits(['update:modelValue'])
</script>
