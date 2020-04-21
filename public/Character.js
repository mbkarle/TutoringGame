class Character extends DataObj {
    constructor(category, name, avatar, dependentAssignments, shield) {
        super();
        //assign necessary character fields
        this.avatar = avatar;
        this.protected = false;
        this.shield = shield;
        this.equipped = [];
        this.crit = .05;
        this.healthBar = "#" + category + "HealthBarSlider";

        //query backend for character data
        let self = this;
        getCharacter(self, category, name, function(self) {
          self.melee = new Action(function(target) {
            target.receiveDamage(self.getAttack());
            self.attackAnimation();
          }, self.getAttackCooldown(), (category=="hero")?"attackSlider":undefined);

          self.dodgeAction = new Action(function() {
             self.dodgeAnimation();
             self.protected = true;
             setTimeout(function() {
               self.protected =false;
             }, 1000);
          }, self.getDodgeCooldown(), (category=="hero")?"dodgeSlider":undefined);
          if(dependentAssignments) {
            dependentAssignments(self);
          }
        });

    }

    //get document id of character symbol
    getAvatarID() {
      return "#" + this.avatar;
    }

    //get combined damage statistic
    getAttack() {
      var damage = this.strength * 2;
      for(var item of this.equipped) {
          if(item.damage) {
              damage += item.damage;
          }
      }
      return (Math.random() < this.crit) ? Math.ceil(damage * 1.1) : damage;
    }

    setProtected(bool) {
      this.protected = bool;
    }

    //check if character is protected
    isProtected() {
      return this.protected;
    }

    isShielded() {
      if(!this.shield) {
        return false;
      }
      else {
        return this.shield.isActive()
      }
    }

    setShielded(bool) {
      if(!this.shield) {
        return false;
      }
      else {
        this.shield.setActive(bool);
        return true;
      }
    }

    canShield() {
      return(this.shield && !this.shield.isBroken() && !this.shield.isActive())
    }

    dodge() {
      this.dodgeAction.act();
    }

    //abstract animation functions
    receiveDamage(damage) {
      if(!this.isProtected()){
        this.health -= damage;
        this.updateStatus();
        if(!this.isAlive()) {
          this.exitCombat();
        }
      }
      else if(this.isShielded()) {
        this.shield.receiveDamage(damage);
      }
      else {
        this.protected = false;
      }
    }

    isAlive() {
      return this.health > 0;
    }

    quickMotion(left, top) {
      $(this.getAvatarID()).stop(false,false).animate({left: left, top: top}, 50)
      .animate({left: "0px", top: "0px"}, 5000 / this.dexterity);
    }

    updateStatus() {
        var proportion = "" + (this.health / this.maxHealth * 100) + "%";
        $(this.healthBar).animate({width: proportion})
    }

    getAttackCooldown() {
      return Math.floor(-4900/24 * (this.dexterity - 1) + 5000);
    }

    getDodgeCooldown() {
      return this.getAttackCooldown() / 2 + 500;
    }

    reset() {
      this.health = this.maxHealth;
      this.updateStatus();
    }

    enterCombat(exit) {
      this.reset();
      this.exit = exit;
    }

    exitCombat() {
      this.exit();
    }
}

class Hero extends Character {
    constructor(name) {
      super("hero", name, "heroSymbol", undefined, new Shield(30, .05));
      this.frame = 0;
    }

    draw() {
      var src = "images/sprite_" + this.frame + ".png";
      $(this.getAvatarID()).children("img").attr("src", src);
      this.frame = (this.frame == 0) ? 1 : 0;
    }

    attackAnimation() {
      super.quickMotion("50px", "-50px");
    }

    dodgeAnimation() {
      super.quickMotion("-30px", "0px");
    }

    attack(target) {
      this.melee.act(target);
    }
}

class Enemy extends Character {
    constructor(name) {
      super("enemy", name, "enemySymbol");
    }

    enterCombat(target) {
      super.enterCombat();
      var self = this;
      this.interval = setInterval(function() {
          self.melee.act(target);
      })
    }

    exitCombat() {
      clearInterval(this.interval);
    }

    attackAnimation() {
      super.quickMotion("-50px", "50px");
    }

    dodgeAnimation() {
      super.quickMotion("30px", "0px");
    }
}

function getCharacter(self, category, name, dependentAssignments) {
    name = (name) ? "&name=" + name : ""; //will get random if no name given
    get("/character?category="+category+name, function(data) {
        self.maxHealth = data["health"];
        self.appendStats(data);
        if(dependentAssignments){
          dependentAssignments(self);
        }

    })
}
