function makeImage(src) {
    const newImage = new Image();
    newImage.src = src;
    return newImage;
}

export class Asset {
    constructor(src, size) {
        this.image = makeImage(src);
        this.size = size
    }
    draw(ctx, x, y, rotation = 0, centre = false) {
        drawImage(ctx, this.image, x, y,
            this.size.x, this.size.y, rotation, centre);
    }
}

function drawImage(ctx, image, x, y, width, height, rotation = 0, centre = true) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    const offsetX = centre ? -width / 2 : 0
    const offsetY = centre ? -height / 2 : 0
    ctx.drawImage(image, offsetX, offsetY, width, height);
    ctx.restore();
}