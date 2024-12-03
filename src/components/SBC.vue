<template>
  <div id="container" class="container mx-auto p-6 shadow">
    <h1>SBC</h1>
    <main>
      <section class="p-6 appearance-auto pointer-events-auto">
        <form method="post">
          <section class="grid grid-cols-[200px_minmax(0,_1fr)] gap-y-3">
            <label for="profile" class="w-auto">profile:</label>
            <textarea id="profile" class="w-full h-full" v-model.trim="profile"> </textarea>

            <label for="subs" class="w-auto">subs:</label>
            <textarea id="subs" class="w-full h-full"
              @change="e => subs = e.target.value.trim().split('\n').filter(x => x.trim() !== '')"> </textarea>

            <label for="filename" class="w-auto">filename:</label>
            <textarea id="filename" class="w-full h-full"
              v-model="filename"> </textarea>
          </section>

          <hr class="m-3" />

          <section class="grid grid-cols-[200px_minmax(0,_1fr)] my-3">
            <label for="outurl">url:</label>
            <input id="outurl" type="text" class="w-full p-3" disabled v-model="url" />
          </section>

          <section class="grid grid-cols-2 my-3">
            <input type="button" value="copy" class="btn" @click="copy" />
            <a :href="url" type="button" value="download" class="btn" @click="download">download</a>
          </section>

          <input type="button" value="generate" class="btn bg-sky-500 my-6" @click="generate" />
        </form>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { digest } from '../fun';

const subs = ref([])
const profile = ref('')
const filename = ref('')
const url = ref('')

function copy() {
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
.btn {
  @apply mx-3 p-3 shadow hover:bg-sky-100
}

#container {
  font-family: Inter, Roboto, "Helvetica Neue", "Arial Nova", "Nimbus Sans",
    Arial, sans-serif;
  height: 100%;
}
</style>
