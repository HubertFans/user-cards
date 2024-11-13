<template>
  <div class="card" ref="cardRef">
    <img :src="user.picture" alt="Фото пользователя" class="card__image" />
    <div class="card__details">
      <div class="card__field">
        <span class="card__field-name">Name: </span> {{ user.name }}
      </div>
      <div class="card__field">
        <span class="card__field-name">Email: </span>
        <span class="card__field-value">{{ user.email }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{
  /** User data */
  user: {
    name?: string,
    email?: string;
    picture?: string;
  };
  /** Scroll observer */
  infiniteScrollObserver: IntersectionObserver | null;
}>();

/** reference to card */
const cardRef = ref<HTMLDivElement>();

onMounted(() => {
  if (cardRef.value && props.infiniteScrollObserver) {
    // observe card if observer exists 
    props.infiniteScrollObserver?.observe(cardRef.value);
  }
});

onUnmounted(() => {
  if (cardRef.value && props.infiniteScrollObserver) {
    // unobserve card
    props.infiniteScrollObserver?.unobserve(cardRef.value);
  }
});
</script>

<style lang="scss" scoped>
.card {
  $image-size: 128px;
  $padding: 12px;
  $gap: 16px;
  display: flex;
  gap: 16px;
  padding: 12px;
  border: 1px solid #bceef5;
  border-radius: 8px;

  &__details {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    max-width: calc(100% - $image-size - $padding - $gap);
  }

  &__image {
    width: 128px;
    height: 128px;
    border-radius: 8px;
    object-fit: cover;
  }

  &__field {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__field-name {
    font-weight: 700;
  }
}
</style>
