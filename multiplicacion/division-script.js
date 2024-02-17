// Initialize Phaser
const config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 900,
    scene: {
      preload: preload,
      create: create
    }
  };
  
  const game = new Phaser.Game(config);
  
  let optionGroup;
  let option1;
  let option2;
  
  function preload() {
    // Preload any assets if needed
    this.load.image('radio','radio.png')
    this.load.image('bgwhite', 'bgwhite.jpeg');

  }
  
  function create() {
    spritebg = this.add.image(340, 250, 'bgwhite');
    spritebg.setScale(3)

    // Create a group to hold the toggle options
    optionGroup = this.add.group();
  
    // Create the first option sprite
    option1 = this.add.sprite(200, 100, 'option1'); // Replace 'option1' with your asset key
    option1.setInteractive({ cursor: 'pointer' });
    option1.on('pointerdown', toggleOption, this);
    optionGroup.add(option1);
  
    // Create the second option sprite
    option2 = this.add.sprite(400, 100, 'option2'); // Replace 'option2' with your asset key
    option2.setInteractive({ cursor: 'pointer' });
    option2.on('pointerdown', toggleOption, this);
    optionGroup.add(option2);
  
    // Initialize the first option as selected
    option1.isSelected = true;
    option1.setTint(0xaaaaa); // Change tint color as desired

    const radioButton = this.add.image(300,500, 'radio', { backgroundColor: 'red', fill:'red', color:'red'})
    radioButton.setInteractive({cursor:'pointer'})
    radioButton.setFrame(1); // Change frame to indicate selected

  }
  
  function toggleOption() {
    if (this.isSelected) {
      return; // Don't toggle if the option is already selected
    }
  
    // Clear tint from all options
    optionGroup.children.iterate(option => {
      option.clearTint();
      option.isSelected = false;
    });
  
    // Toggle the selected option
    this.setTint(0xFF0000); // Change tint color as desired
    this.isSelected = true;

    
  }
  