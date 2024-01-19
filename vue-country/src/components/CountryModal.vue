<script setup lang="ts">
    import { ref, defineProps, onMounted, onBeforeUnmount } from 'vue';
    const { country } = defineProps(['country']);
    const check =ref(true);
    
    const closeModal = () => {
    check.value=false;
    };

    // Close modal when the component is unmounted (optional)
    onBeforeUnmount(() => {
    closeModal();
    });
</script>


<template>
  <div v-if="check" class="modal-overlay" v-show="country" @click="closeModal">
    <div class="modal" @click.stop>
      <span class="close" @click="closeModal">&times;</span>
      <h2>{{ country.name.official }}</h2>
      <div class="modal-info">
        <img :src="country.flags.png" alt="Country Flag" />
        <p><strong>2 character Country Code:</strong> {{ country.cca2 }}</p>
        <p><strong>3 character Country Code:</strong> {{ country.cca3 }}</p>
        <!-- Add more properties as needed -->
      </div>
    </div>
  </div>
</template>



<style scoped>
/* Add your modal styles here */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* Modal Styles */
.modal {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  position: relative;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

/* Close Button Styles */
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 18px;
  cursor: pointer;
}

/* Additional styling for the modal content */
.modal-info {
  margin-top: 20px;
}

/* Body overflow hidden when modal is open */
body.modal-open {
  overflow: hidden;
}
</style>
