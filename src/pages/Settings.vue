<template>
  <div>
    <!-- Header -->
    <div class="relative mb-10">
      <div class="absolute -top-8 -left-8 w-40 h-40 bg-gray-200/20 rounded-full blur-3xl"></div>
      <div class="relative">
        <p class="text-[10px] font-bold text-text-mid uppercase tracking-[0.2em] mb-2 anim-fade-up">System Configuration</p>
        <h1 class="text-4xl font-serif font-bold text-brand-dark mb-1 anim-fade-up anim-delay-1">Settings</h1>
        <p class="text-text-mid text-sm anim-fade-up anim-delay-2">Manage your account preferences and system settings</p>
      </div>
    </div>

    <!-- Settings Sections -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 anim-fade-up anim-delay-3">
      <!-- Profile Settings -->
      <div class="bg-white rounded-3xl shadow-card p-6 border border-brand-pale/20">
        <h3 class="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
          <UserIcon class="w-5 h-5 text-brand-green" />
          Account Details
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-2">Display Name</label>
            <input type="text" class="w-full bg-cream border-2 border-brand-pale/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors" value="John Doe" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-text-mid uppercase tracking-[0.15em] mb-2">Email Address</label>
            <input type="email" class="w-full bg-cream border-2 border-brand-pale/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors" value="john@example.com" />
          </div>
          <button class="bg-brand-green text-white font-bold rounded-xl px-6 py-2.5 text-sm hover:bg-green-600 transition-colors shadow-btn">
            Save Changes
          </button>
        </div>
      </div>

      <!-- Preferences -->
      <div class="bg-white rounded-3xl shadow-card p-6 border border-brand-pale/20">
        <h3 class="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
          <BellIcon class="w-5 h-5 text-brand-dark" />
          Notifications & Security
        </h3>
        <div class="space-y-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-brand-dark">Email Notifications</p>
              <p class="text-xs text-text-mid mt-0.5">Receive alerts for appointments and messages</p>
            </div>
            <div class="w-12 h-6 bg-brand-green rounded-full relative cursor-pointer">
              <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 left-6 shadow-sm"></div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-bold text-brand-dark">Two-Factor Authentication</p>
              <p class="text-xs text-text-mid mt-0.5">Secure your account with 2FA</p>
            </div>
            <div class="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
              <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
            </div>
          </div>
          
          <div class="pt-4 border-t border-brand-pale/30 mt-4">
            <button class="text-danger text-sm font-bold hover:underline">Change Password</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { UserIcon, BellIcon } from '@heroicons/vue/24/outline'
</script>
