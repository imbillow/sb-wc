<template>
  <div id="container" class="min-h-screen bg-gradient-to-br from-sky-50 to-white dark:from-gray-900 dark:to-gray-800">
    <div class="container mx-auto p-4 sm:p-8 max-w-5xl">
      <div class="flex justify-between items-center mb-6 sm:mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-sky-900 dark:text-sky-100">SBC</h1>
        <div class="relative">
          <select 
            v-model="theme" 
            class="appearance-none rounded-lg bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 py-2 pl-9 pr-8 text-sm focus:border-sky-500 focus:ring-sky-500"
            @change="handleThemeChange"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
            <!-- System icon -->
            <svg v-if="theme === 'system'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <!-- Sun icon -->
            <svg v-else-if="theme === 'light'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <!-- Moon icon -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      <main class="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <section class="p-4 sm:p-8">
          <form method="post" class="space-y-6" @submit.prevent="handleSubmit">
            <section class="grid grid-cols-1 sm:grid-cols-[140px_minmax(0,_1fr)] lg:grid-cols-[160px_minmax(0,_1fr)] gap-2 sm:gap-6">
              <label for="profile" class="text-gray-700 dark:text-gray-300 font-medium sm:pt-2">Profile:</label>
              <div class="space-y-1">
                <textarea 
                  id="profile" 
                  class="w-full min-h-[100px] rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-sky-500 focus:ring-sky-500" 
                  :class="{ 'border-red-500 dark:border-red-500': profileError }"
                  v-model.trim="profile"
                  @input="validateProfile"
                ></textarea>
                <p v-if="profileError" class="text-sm text-red-500">{{ profileError }}</p>
              </div>

              <label for="subs" class="text-gray-700 dark:text-gray-300 font-medium sm:pt-2">Subs:</label>
              <div class="space-y-1">
                <textarea 
                  id="subs" 
                  class="w-full min-h-[100px] rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  :class="{ 'border-red-500 dark:border-red-500': subsError }"
                  v-model="subsText"
                  @input="validateSubs"
                ></textarea>
                <p v-if="subsError" class="text-sm text-red-500">{{ subsError }}</p>
              </div>

              <label for="filename" class="text-gray-700 dark:text-gray-300 font-medium sm:pt-2">Filename:</label>
              <div class="space-y-1">
                <textarea 
                  id="filename" 
                  class="w-full min-h-[60px] rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                  :class="{ 'border-red-500 dark:border-red-500': filenameError }"
                  v-model.trim="filename"
                  @input="validateFilename"
                ></textarea>
                <p v-if="filenameError" class="text-sm text-red-500">{{ filenameError }}</p>
              </div>
            </section>

            <hr class="my-6 border-gray-200 dark:border-gray-700" />

            <section class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-[140px_minmax(0,_1fr)] lg:grid-cols-[160px_minmax(0,_1fr)] gap-2 sm:gap-4 items-center">
                <label for="outurl" class="text-gray-700 dark:text-gray-300 font-medium">URL:</label>
                <input id="outurl" type="text" class="w-full p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg border-gray-300 dark:border-gray-600" disabled v-model="url" />
              </div>

              <div class="flex flex-row justify-end gap-3 sm:gap-4 mt-4">
                <button 
                  type="button" 
                  class="btn-primary w-full sm:w-auto" 
                  @click="copy"
                  :disabled="!isFormValid"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copy URL
                </button>
                <a 
                  :href="url" 
                  class="btn-secondary w-full sm:w-auto text-center" 
                  @click="download"
                  :class="{ 'pointer-events-none': !isFormValid }"
                  :disabled="!isFormValid"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                  Download
                </a>
                <button 
                  type="button" 
                  class="btn-primary w-full sm:w-auto" 
                  @click="generate"
                  :disabled="!isFormValid"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  Generate
                </button>
              </div>
            </section>

            <hr class="my-6 border-gray-200 dark:border-gray-700" />
          </form>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { digest } from '../fun';

const profile = ref('')
const profileError = ref('')
const filename = ref('')
const filenameError = ref('')
const url = ref('')
const theme = ref('system')

// Separate refs for subs text input and processed array
const subsText = ref('')
const subs = ref([])
const subsError = ref('')

// URL validation regex
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/

// Computed property for overall form validity
const isFormValid = computed(() => {
  validateProfile()
  validateSubs()
  validateFilename()
  return !profileError.value && !subsError.value && !filenameError.value &&
         profile.value && subs.value.length > 0 && filename.value
})

// Profile validation
function validateProfile() {
  try {
    if (!profile.value) {
      profileError.value = 'Profile is required'
      return
    }
    JSON.parse(profile.value)
    profileError.value = ''
  } catch (e) {
    profileError.value = 'Invalid JSON format'
  }
}

// Subs validation
function validateSubs() {
  if (!subsText.value) {
    subsError.value = 'At least one subscription URL is required'
    subs.value = []
    return
  }

  const urls = subsText.value.split('\n').filter(url => url.trim())
  const invalidUrls = urls.filter(url => !urlRegex.test(url.trim()))

  if (invalidUrls.length > 0) {
    subsError.value = `Invalid URL format: ${invalidUrls.join(', ')}`
    subs.value = []
  } else if (urls.length === 0) {
    subsError.value = 'At least one subscription URL is required'
    subs.value = []
  } else {
    subsError.value = ''
    subs.value = urls
  }
}

// Filename validation
function validateFilename() {
  if (!filename.value) {
    filenameError.value = 'Filename is required'
    return
  }
  
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/
  if (invalidChars.test(filename.value)) {
    filenameError.value = 'Filename contains invalid characters'
    return
  }
  
  if (filename.value.length > 255) {
    filenameError.value = 'Filename is too long'
    return
  }
  
  filenameError.value = ''
}

// Form submission handler
function handleSubmit() {
  if (isFormValid.value) {
    generate()
  }
}

onMounted(() => {
  // Theme initialization
  const savedTheme = localStorage.getItem('theme') || 'system'
  theme.value = savedTheme
  updateTheme()
  
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (theme.value === 'system') {
      updateTheme()
    }
  })
})

// Computed property to determine if dark mode should be active
const isDarkMode = computed(() => {
  if (theme.value === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return theme.value === 'dark'
})

function updateTheme() {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

function handleThemeChange() {
  localStorage.setItem('theme', theme.value)
  updateTheme()
}

async function copy() {
  await navigator.clipboard.writeText(url.value);
  alert('copied');
}

function download() {
  Astro.redirect('/login');
}

async function generate() {
  const body = JSON.stringify({
    profile: profile.value,
    subs: subs.value,
    filename: filename.value,
  });
  const hashString = await digest(body);
  console.log(hashString);

  const res = await fetch("/profile/upload", {
    method: "POST",
    body: body,
    headers: {
      "x-content-digest": `SHA-256=${hashString}`
    }
  });
  if (res.ok) {
    const reqj = await res.json();
    url.value = reqj.url;
  } else {
    const reqj = await res.json();
    console.error(reqj.message);
  }
}

</script>

<style>
.btn-primary {
  @apply inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm 
    text-white bg-sky-600 
    hover:bg-sky-700 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 
    transition-colors duration-200
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-sky-600;
}

.btn-primary[disabled], .btn-primary.disabled {
  @apply opacity-50 cursor-not-allowed hover:bg-sky-600;
}

.btn-secondary {
  @apply inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg shadow-sm 
    border border-gray-300 dark:border-gray-600
    text-gray-700 dark:text-gray-300
    bg-white dark:bg-gray-800
    hover:bg-gray-50 dark:hover:bg-gray-700
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-gray-800
    transition-colors duration-200;
}

.btn-secondary[disabled], .btn-secondary.disabled {
  @apply opacity-50 cursor-not-allowed 
    hover:bg-white dark:hover:bg-gray-800
    border-gray-200 dark:border-gray-700
    text-gray-400 dark:text-gray-500;
}

#container {
  font-family: Inter, Roboto, "Helvetica Neue", "Arial Nova", "Nimbus Sans",
    Arial, sans-serif;
}

textarea, input[type="text"] {
  @apply transition-all duration-200;
}

textarea:focus, input[type="text"]:focus {
  @apply transform scale-[1.01];
}

.container {
  @apply transition-all duration-300 ease-in-out;
}

@media (max-width: 640px) {
  textarea, input[type="text"] {
    @apply text-base;
  }
  
  .btn-primary, .btn-secondary {
    @apply text-sm;
  }
}
</style>
