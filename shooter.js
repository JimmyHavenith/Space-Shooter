( function() {

	"use strict";

		//ship, some variables
		var canvas,
		    ctx,
		    width = 600,
		    height = 600,
		    enemy,
		    ship,
		    explosion,
		    asteroid, 
		    asteroid_destroy,
		    starfield,
		    starX = 0,
		    starY = 0, 
		    starY2 = -600,
		    lasers = [],
		    laserTotal = 2,
		    score = 0,
		    alive = true,
		    lives = 3,
		    rightKey = false,
		    leftKey = false,
		    upKey = false,
		    downKey = false,
		    enemyTotal = 6,
		    enemies = [],
		    enemy_x = 50,
		    enemy_y = -45,
		    enemy_w = 50,
		    enemy_h = 15,
		    speed = 7,
		    asteroids = [],
		    asteroidTotal = 3,
		   	asteroid_x = 30,
		   	asteroid_y = -45,
		   	asteroid_w = 40,
		   	asteroid_h = 15,
		    speed_ast = 8,
		    ship_x = (width / 2) - 45, 
		    ship_y = height - 75, 
		    ship_w = 50, 
		    ship_h = 30;


		    for ( var i = 0; i < enemyTotal; i++ ) {
		    	enemies.push( [enemy_x, enemy_y, enemy_w, enemy_h, speed] );
		    	enemy_x += enemy_w + 50;
		    }

		    for ( var k = 0; k < asteroidTotal; k++ ) {
		    	asteroids.push( [asteroid_x, asteroid_y, asteroid_w, asteroid_h, speed_ast] );
		    	asteroid_x += asteroid_w + 150;
		    }
			//position et dimension initial du vaisseau

		function clearCanvas() {
			ctx.clearRect(0,0,width,height);
		}
		//On doit l'avoir pour que ca fonctionne, c'est 
		//pour éviter qu'il y a plein de vaisseaux.
		//Ca efface tout

		function drawShip() {
			if ( rightKey ) ship_x += 5;
			else if ( leftKey ) ship_x -= 5;
			if ( upKey ) ship_y -= 5;
			else if ( downKey ) ship_y += 5;
			//déplace le vaisseau dans le cadre

			if ( ship_x <= -20 ) ship_x = -20;
  			if ( ( ship_x + ship_w ) >= width ) ship_x = width - ship_w;
  			if ( ship_y <= -20 ) ship_y = -20;
  			if ( ( ship_y + ship_h ) >= height ) ship_y = height - ship_h;
  			//délimite les bords du cadre pour que le vaisseau ne dépasse pas !

	  		// ctx.fillStyle = '#0f0';
	  		// ctx.fillRect( ship_x, ship_y, ship_w, ship_h );
	  		// AVANT, un rectangle, MAINTENANT un VRAI vaisseau
	  		ctx.drawImage( ship, ship_x, ship_y);
		}
		//On afficle le rectangle en couleur et sa positon en x y
		//puis sa taille en w h

		function setup() {
			canvas = document.getElementById('game');
			ctx = canvas.getContext( '2d' );
			enemy = new Image();
			enemy.src = 'enemy.png';
			ship = new Image();
			ship.src = 'ship.png';
			explosion = new Image();
			explosion.src = 'explosion.png';
			asteroid = new Image();
			asteroid.src = 'asteroid.png';
			asteroid_destroy = new Image();
			asteroid_destroy.src = 'asteroid_destroy.png';
			starfield = new Image();
			starfield.src = 'starfield.jpg';
			//setInterval( gameLoop, 25 );
			document.addEventListener( 'keydown', keyDown, false );
			document.addEventListener( 'keyup', keyUp, false );
			gameLoop();

		}
		//on obtient l'élément canvas + son contexte
		//setInterval appel la fonction gameLoop toute les 25 millisecondes

		function gameLoop() {
			clearCanvas();
			drawStarfield();
			if ( alive ) {
				drawEnemies();
				drawShip();
				drawLaser(); 
				drawAsteroids();
				moveAsteroids();
				moveEnemies();
				moveLaser();
				hitEnemies();
				hitAst();
				shipCollision();
				shipCollisionAst();
			}
			scoreTotal();
			game = setTimeout( gameLoop, 1000 / 30 );
		}
		//gameLoop appel les fonction clearcanvas et drawship
		function keyDown( e ) {
			if ( e.keyCode == 39 ) rightKey = true;
			else if ( e.keyCode == 37 ) leftKey = true;
			if ( e.keyCode == 38 ) upKey = true;
			else if ( e.keyCode == 40 ) downKey = true;

			if ( e.keyCode == 32 && lasers.length <= laserTotal ) lasers.push( [ship_x + 48, ship_y - 0, 2, 20] );
		}

		function keyUp( e ) {
			if ( e.keyCode == 39 ) rightKey = false;
			else if ( e.keyCode == 37 ) leftKey = false;
			if ( e.keyCode == 38 ) upKey = false;
			else if ( e.keyCode == 40) downKey = false;
		}
	
		function drawEnemies() { 
			for ( var i = 0; i < enemies.length; i++ ) {
				// ctx.fillStyle = '#f00';
				// ctx.fillRect( enemies[i][0], enemies[i][1], enemy_w, enemy_h );
				ctx.drawImage( enemy, enemies[i][0], enemies[i][1] );
			}
		}

		function drawAsteroids() {
			for ( var k = 0; k < asteroids.length; k++ ) {
				ctx.drawImage( asteroid, asteroids[k][0], asteroids[k][1] );
			}
		}

		function moveEnemies() {
			for ( var i = 0; i < enemies.length; i++ ) {
   				if ( enemies[i][1] < height ) {
      				enemies[i][1] += enemies[i][4];
    			} else if ( enemies[i][1] > height - 1 ) {
      				enemies[i][1] = -45;
   				 }
  			}
		}

		function moveAsteroids() {
			for ( var k = 0; k < asteroids.length; k++ ) {
				if ( asteroids[k][1] < height ) {
					asteroids[k][1] += asteroids[k][4];
				} else if ( asteroids[k][1] > height - 1 ) {
					asteroids[k][1] = -45;
				} 
			}
		}

		function drawLaser() {
			if ( lasers.length ) {
				for ( var i = 0; i < lasers.length; i++ ) {
					ctx.fillStyle = '#0f0';
					ctx.fillRect( lasers [i][0], lasers[i][1], lasers[i][2], lasers[i][3] );
				}
			}
		}

		function moveLaser() {
			for ( var i = 0; i < lasers.length; i++ ) {
				if ( lasers[i][1] > -11 ) {
					lasers[i][1] -= 20;
				} else if ( lasers[i][1] < -13 ) {
					lasers.splice( i, 1 );
				}
			}
		}

		function hitEnemies() {
			var remove = false;
			for ( var i = 0; i < lasers.length; i++ ) {
				for ( var j = 0; j < enemies.length; j++ ) {
					if ( lasers[i][1] <= (enemies[j][1] + enemies[j][3]) && lasers[i][0] >= enemies[j][0] && lasers[i][0] <= ( enemies[j][0] + enemies[j][2])) {
						remove = true;
						var x_coord = enemies[j][0];
						var y_coord = enemies[j][1];
						ctx.drawImage( explosion, x_coord, y_coord );
						enemies.splice( j, 1 );
						score += 1;
						enemies.push([(Math.random() * 500) + 50, -45, enemy_w, enemy_h, speed]);
					}
				}
				if ( remove == true ) {
					lasers.splice( i, 1 );
					remove = false;
				}
			}
		}

		function hitAst() {
			var remove = false;
			for ( var i = 0; i < lasers.length; i++ ) {
				for ( var k = 0; k < asteroids.length; k++ ) {
					if ( lasers[i][1] <= (asteroids[k][1] + asteroids[k][3]) && lasers[i][0] >= asteroids[k][0] && lasers[i][0] <= ( asteroids[k][0] + asteroids[k][2])) {
						remove = true;
						var x_coord = asteroids[k][0];
						var y_coord = asteroids[k][1];
						ctx.drawImage( asteroid_destroy, x_coord, y_coord );
						asteroids.splice( k, 1 );	
						asteroids.push([(Math.random() * 500) + 50, -45, asteroid_w, asteroid_h, speed_ast]);

					}
				}
				if ( remove == true ) {
					lasers.splice( i, 1 );
					remove = false;
				}
			}

		}

		function shipCollision() {
			var ship_xw = ship_x + ship_w,
				ship_yh = ship_y + ship_h;
			for ( var i = 0; i < enemies.length; i++ ) {
				if ( ship_x > enemies[i][0] && ship_x < enemies[i][0] + enemy_w && ship_y > enemies[i][1] && ship_y < enemies[i][1] + enemy_h ) {
					alive = false;
				}
				if ( ship_xw < enemies[i][0] + enemy_w && ship_xw > enemies[i][0] && ship_y > enemies[i][1] && ship_y < enemies[i][1] + enemy_h ) {
					alive = false;
				}
				if ( ship_yh > enemies[i][1] && ship_yh < enemies[i][1] + enemy_h && ship_x > enemies[i][0] && ship_x < enemies[i][0] + enemy_w ) {
					alive = false;
				}
				if ( ship_yh > enemies[i][1] && ship_yh < enemies[i][1] + enemy_h && ship_xw < enemies[i][0] + enemy_w && ship_xw > enemies[i][0] ) {
					alive = false;
				}
			}
		}

		function shipCollisionAst() {
			var ship_xw = ship_x + ship_w,
				ship_yh = ship_y + ship_h;
			for ( var i = 0; i < asteroids.length; i++ ) {
				if ( ship_x > asteroids[i][0] && ship_x < asteroids[i][0] + asteroid_w && ship_y > asteroids[i][1] && ship_y < asteroids[i][1] + asteroid_h ) {
					alive = false;
				}
				if ( ship_xw < asteroids[i][0] + asteroid_w && ship_xw > asteroids[i][0] && ship_y > asteroids[i][1] && ship_y < asteroids[i][1] + asteroid_h ) {
					alive = false;
				}
				if ( ship_yh > asteroids[i][1] && ship_yh < asteroids[i][1] + asteroid_h && ship_x > asteroids[i][0] && ship_x < asteroids[i][0] + asteroid_w ) {
					alive = false;
				}
				if ( ship_yh > asteroids[i][1] && ship_yh < asteroids[i][1] + asteroid_h && ship_xw < asteroids[i][0] + asteroid_w && ship_xw > asteroids[i][0] ) {
					alive = false;
				}
			}
		}

		function scoreTotal() {
			ctx.font = '18px VT323';
			ctx.fillStyle = '#fff';
			ctx.fillText( 'Score: ', 490, 30 );
			ctx.fillText( score, 550, 30 );
			if ( !alive ) {
				ctx.fillText( 'Game Over !', 245, height / 2 ); 
				ctx.fillText( ( width / 2 ) -53, ( height / 2 ) +10, 1000, 40 );
			}
		}

		function drawStarfield() {
			ctx.drawImage(starfield, starX, starY );
			ctx.drawImage(starfield, starX, starY2 );
			if( starY > 600 ) {
				starY = -599;
			}
			if ( starY2 > 600 ) {
				starY2 = -599;
			}
			starY +=1;
			starY2 +=1;
		}

		window.onload = setup;

} ) ();