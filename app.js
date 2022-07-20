function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      monsterHealth: 100,
      playerHealth: 100,
      currentRound: 0,
      winner: null,
      gameLog: [],
    };
  },
  computed: {
    monsterHealthbar() {
      const health = this.monsterHealth;
      return { width: health + "%" };
    },
    playerHealthbar() {
      const health = this.playerHealth;
      return { width: health + "%" };
    },
    mayUseSpecial() {
      return this.currentRound % 3 !== 0;
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "monster";
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "player";
      }
    },
  },
  methods: {
    attackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(5, 12);
      if (this.monsterHealth - attackValue < 0) {
        this.monsterHealth = 0;
      } else {
        this.monsterHealth -= attackValue;
      }

      this.addLogMessage("player", "attack", attackValue);
      this.attackPlayer();
    },
    attackPlayer() {
      const attackValue = getRandomValue(8, 15);
      if (this.playerHealth - attackValue < 0) {
        this.playerHealth = 0;
      } else {
        this.playerHealth -= attackValue;
      }

      this.addLogMessage("monster", "attack", attackValue);
    },
    specialAttackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(10, 25);
      this.monsterHealth -= attackValue;

      this.addLogMessage("player", "special attack", attackValue);
      this.attackPlayer();
    },
    healPlayer() {
      this.currentRound++;
      const healValue = getRandomValue(8, 20);
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }

      this.addLogMessage("player", "heal", healValue);
      this.attackPlayer();
    },
    startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.winner = null;
      this.currentRound = 0;
      this.gameLog = [];
    },
    surrender() {
      this.winner = "monster";
    },
    addLogMessage(who, what, value) {
      this.gameLog.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});

app.mount("#game");
