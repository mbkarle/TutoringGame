function shieldOn(user) {
    if(!user.canShield()) {
        return false;
    }
    else {
        user.setProtected(true);
        shieldOnAnimation(user);
        user.setShielded(true);
        return true;
    }
}

function shieldOff(user) {
    shieldOffAnimation(user);
    user.setProtected(false);
    user.setShielded(false);
}

function shieldOnAnimation(user) {
    $(user.getAvatarID()).css({border: "dashed 1px"}, 1000);
}

function shieldOffAnimation(user) {
    $(user.getAvatarID()).css({border: "none"}, 1000);
}
