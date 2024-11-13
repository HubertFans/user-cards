<template>
  <header class="header">
    <h1>Users</h1>
  </header>

  <main class="main">
    <UserCard
      v-for="(user, index) in users"
      :infinite-scroll-observer="
        index === users.length - LOAD_USERS_TRESHHOLD ? infiniteScrollObserver : null
      "
      :key="index"
      :user="{
        name: `${user.name.title} ${user.name.first} ${user.name.last}`,
        picture: user.picture.large,
        email: user.email,
      }"
    />
  </main>
  <div v-if="isLoading" class="loader">Загрузка...</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { fetchRandomUsers, type RandomUsersResponse } from './api';
import UserCard from './components/UserCard.vue';

/** The number of the element from the end, after which new elements will be loaded */
const LOAD_USERS_TRESHHOLD = 10;

/** Loaded users */
const users = ref<Array<RandomUsersResponse>>([]);

/** Loading state */
const isLoading = ref(false);

/** Number of loaded pages (infinity scroll step) */
const currentPage = ref(1);
/** Load more users */
const getMoreUsers = async () => {
  isLoading.value = true;
  // get new page users
  const newUsers = await fetchRandomUsers(currentPage.value);
  isLoading.value = false;
  users.value.push(...(newUsers || []));
  // increase page number for next loading
  currentPage.value++;
};

// loading initial user pack
getMoreUsers();

/** Observer for loading users */
const infiniteScrollObserver = ref<IntersectionObserver | null>(null);

onMounted(() => {
  // when the observed card comes into view, load more users
  infiniteScrollObserver.value = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      // if the element is observable
      if (entry.isIntersecting) {
        // load next users pack
        getMoreUsers();
        // we stop monitoring because it will be installed on the card from the next users pack
        observer.unobserve(entry.target);
      }
    });
  });
});

onUnmounted(() => {
  // stop observing
  infiniteScrollObserver.value?.disconnect();
});
</script>

<style scoped>
.main {
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 16px;
}

.header {
  position: sticky;
  top: 0;
  padding-top: 12px;
  background-color: white;
  border-bottom: 3px solid #009db5;
  font-size: 20px;
  z-index: 1;

  h1 {
    margin: 0;
  }
}
.loader {
  text-align: center;
  padding-bottom: 16px;
}
</style>
