
bg.THREE_CreateDebugText = function(txt)
{
	var lineMaterial = new THREE.LineBasicMaterial( { color: 0xFFFFFF } );
	var lineGeometry = new THREE.Geometry();
	
	
	var pts = [
		new THREE.Vector3( -0.5, 1, 0),
		new THREE.Vector3( 0, 1, 0),
		new THREE.Vector3( 0.5, 1, 0),
		
		new THREE.Vector3( -0.5, 0.5, 0),
		new THREE.Vector3( 0, 0.5, 0),
		new THREE.Vector3( 0.5, 0.5, 0),
		
		new THREE.Vector3( -0.5, 0, 0),
		new THREE.Vector3( 0, 0, 0),
		new THREE.Vector3( 0.5, 0, 0),
		
		new THREE.Vector3( -0.5, -0.5, 0),
		new THREE.Vector3( 0, -0.5, 0),
		new THREE.Vector3( 0.5, -0.5, 0),
		
		new THREE.Vector3( -0.5, -1, 0),
		new THREE.Vector3( 0, -1, 0),
		new THREE.Vector3( 0.5, -1, 0)
	];
	
	//		[0]		[1]		[2]
	//             (0,1)
	//
	//		[3]		[4]		[5]
	//
	//
	//		[6]		[7]		[8]
	//	  (-0.5,0) (0,0)  (0.5,0)
	//
	//		[9]		[10]	[11]
	//
	//
	//		[12]	[13]	[14]
	//             (0,-1)

	var charOff = new THREE.Vector3(0,0,0);
	function AddLine(fromIdx, toIdx)
	{
		lineGeometry.vertices.push(pts[fromIdx].clone().add(charOff), pts[toIdx].clone().add(charOff));
	};
	
	var dotOff = new THREE.Vector3(0,0.1,0);
	function AddDot(vIdx)
	{
		lineGeometry.vertices.push(pts[vIdx].clone().add(charOff).add(dotOff), pts[vIdx].clone().add(charOff).sub(dotOff));
	};
		
	var txtLen = txt.length;
	for(var i=0; i<txtLen; ++i)
	{
		switch(txt[i])
		{
			case '!':
				AddLine(1,10);
				AddDot(13);
				break;
				
			case '"':
				AddLine(3,0);
				AddLine(2,5);
				break;
				
			case '£':
			//?????? character encoding issue.
				AddLine(5,1);
				AddLine(1,3);
				AddLine(3,12);
				AddLine(12,14);
				AddLine(6,8);
				break;
				
			case '$':
				AddLine(1,4);
				AddLine(3,5);
				AddLine(3,11);
				AddLine(11,9);
				AddLine(10,13);
				break;
			case '%':
				AddDot(3);
				AddLine(12,2);
				AddDot(11);
				break;
			case '^':
				AddLine(3,1);
				AddLine(1,5);
				break;
			case '&':
				AddLine(1,5);
				AddLine(1,3);
				AddLine(5,9);
				AddLine(3,11);
				AddLine(11,13);
				AddLine(9,13);
				AddLine(8,14);
				break;
			case '*':
				AddLine(6,2);
				AddLine(0,8);
				AddLine(1,7);
				AddLine(3,5);
				break;
			case '(':
				AddLine(3,1);
				AddLine(3,9);
				AddLine(9,13);
				break;
			case ')':
				AddLine(5,1);
				AddLine(5,11);
				AddLine(11,13);
				break;
			case '_':
				AddLine(12,14);
				break;
			case '+':
				AddLine(6,8);
				AddLine(4,10);
				break;
			case '-':
				AddLine(6,8);
				break;
			case '=':
				AddLine(3,5);
				AddLine(6,8);
				break;
			case '[':
				AddLine(0,1);
				AddLine(0,12);
				AddLine(12,13);
				break;
			case ']':
				AddLine(2,1);
				AddLine(2,14);
				AddLine(14,13);
				break;
			case '{':
				AddLine(4,2);
				AddLine(4,10);
				AddLine(7,6);
				AddLine(10,14);
				break;
			case '}':
				AddLine(4,0);
				AddLine(4,10);
				AddLine(7,8);
				AddLine(10,12);
				break;
			case ';':
				AddDot(7);
				AddLine(12,10);
				break;
			case '\'':
				AddLine(1,4);
				break;
			case '#':
				AddLine(1,12);
				AddLine(2,13);
				AddLine(3,5);
				AddLine(9,11);
				break;
			case ':':
				AddDot(4);
				AddDot(7);
				break;
			case '@':
				break;
			case '~':
				AddLine(6,4);
				AddLine(10,4);
				AddLine(10,8);
				break;
			case ',':
				AddLine(12,10);
				break;
			case '.':
				AddDot(13);
				break;
			case '/':
				AddLine(2,12);
				break;
			case '<':
				AddLine(2,6);
				AddLine(6,14);
				break;
			case '>':
				AddLine(0,8);
				AddLine(8,12);
				break;
			case '?':
				AddLine(0,2);
				AddLine(2,8);
				AddLine(8,7);
				AddLine(7,10);
				AddDot(13);
				break;
			case '\\':
				AddLine(0,14);
				break;
				
			case '0':
				AddLine(0,2);
				AddLine(2,14);
				AddLine(14,12);
				AddLine(12,0);
				AddLine(12,2);
				break;
				
			case '1':
				AddLine(1,13);
				break;
				
			case '2':
				AddLine(0,2);
				AddLine(2,8);
				AddLine(8,6);
				AddLine(6,12);
				AddLine(12,14);
				break;
				
			case '3':
				AddLine(0,2);
				AddLine(2,14);
				AddLine(6,8);
				AddLine(12,14);
				break;
				
			case '4':
				AddLine(0,6);
				AddLine(6,8);
				AddLine(2,14);
				break;
			
			case '5':
				AddLine(2,0);
				AddLine(0,6);
				AddLine(6,8);
				AddLine(8,14);
				AddLine(14,12);
				break;
			
			case '6':
				AddLine(2,0);
				AddLine(0,12);
				AddLine(12,14);
				AddLine(14,8);
				AddLine(8,6);
				break;
				
			case '7':
				AddLine(0,2);
				AddLine(2,14);
				break;
				
			case '8':
				AddLine(0,2);
				AddLine(2,14);
				AddLine(14,12);
				AddLine(12,0);
				AddLine(6,8);
				break;
				
			case '9':
				AddLine(0,2);
				AddLine(2,14);
				AddLine(6,8);
				AddLine(6,0);
				break;
			
			case 'A':
			case 'a':
				AddLine(12,3);
				AddLine(3,1);
				AddLine(1,5);
				AddLine(5,14);
				AddLine(6,8);
				break;
				
			case 'B':
			case 'b':
				AddLine(0,1);
				AddLine(1,5);
				AddLine(5,7);
				AddLine(7,6);
				AddLine(7,11);
				AddLine(11,13);
				AddLine(13,12);
				AddLine(12,0);
				break;
			
			case 'C':
			case 'c':
				AddLine(2,1);
				AddLine(1,3);
				AddLine(3,9);
				AddLine(9,13);
				AddLine(13,14);
				break;
				
			case 'D':
			case 'd':
				AddLine(0,12);
				AddLine(0,1);
				AddLine(1,5);
				AddLine(5,11);
				AddLine(11,13);
				AddLine(12,13);
				break;
				
			case 'E':
			case 'e':
				AddLine(0,2);
				AddLine(0,12);
				AddLine(12,14);
				AddLine(6,8);
				break;
				
			case 'F':
			case 'f':
				AddLine(0,2);
				AddLine(0,12);
				AddLine(6,8);
				break;
				
			case 'G':
			case 'g':
				AddLine(3,1);
				AddLine(1,5);
				AddLine(11,13);
				AddLine(13,9);
				AddLine(9,3);
				AddLine(11,8);
				AddLine(7,8);
				break;
				
			case 'H':
			case 'h':
				AddLine(0,12);
				AddLine(2,14);
				AddLine(6,8);
				break;
				
			case 'I':
			case 'i':
				AddLine(0,2);
				AddLine(1,13);
				AddLine(12,14);
				break;
			
			case 'J':
			case 'j':
				AddLine(0,2);
				AddLine(1,10);
				AddLine(10,12);
				break;
			
			case 'K':
			case 'k':
				AddLine(0,12);
				AddLine(6,14);
				AddLine(6,2);
				break;
			
			case 'L':
			case 'l':
				AddLine(0,12);
				AddLine(12,14);
				break;
				
			case 'M':
			case 'm':
				AddLine(0,12);
				AddLine(0,7);
				AddLine(7,2);
				AddLine(2,14);
				break;
				
			case 'N':
			case 'n':
				AddLine(0,12);
				AddLine(0,14);
				AddLine(2,14);
				break;
			
			case 'O':
			case 'o':
				AddLine(3,1);
				AddLine(1,5);
				AddLine(5,11);
				AddLine(11,13);
				AddLine(13,9);
				AddLine(9,3);
				break;
				
			case 'P':	
			case 'p':
				AddLine(0,12);
				AddLine(0,2);
				AddLine(2,8);
				AddLine(8,6);
				break;
				
			case 'Q':
			case 'q':
				AddLine(3,1);
				AddLine(1,5);
				AddLine(5,11);
				AddLine(11,13);
				AddLine(13,9);
				AddLine(9,3);
				AddLine(10,14);
				break;
				
			case 'R':
			case 'r':
				AddLine(0,12);
				AddLine(0,2);
				AddLine(2,8);
				AddLine(8,6);
				AddLine(7,14);
				break;
				
			case 'S':
			case 's':
				AddLine(0,2);
				AddLine(0,6);
				AddLine(12,14);
				AddLine(6,8);
				AddLine(8,14);
				break;			
			
			case 'T':
			case 't':
				AddLine(0,2);
				AddLine(1,13);
				break;			
			
			case 'U':
			case 'u':
				AddLine(0,12);
				AddLine(12,14);
				AddLine(14,2);
				break;
			
			case 'V':
			case 'v':
				AddLine(0,6);
				AddLine(6,13);
				AddLine(8,13);
				AddLine(8,2);
				break;
			
			case 'W':
			case 'W':
				AddLine(0,12);
				AddLine(12,10);
				AddLine(10,14);
				AddLine(14,2);
				AddLine(4,10);
				break;
				
			case 'X':
			case 'x':
				AddLine(0,14);
				AddLine(2,12);
				break;
			
			case 'Y':
			case 'y':
				AddLine(0,7);
				AddLine(7,2);
				AddLine(7,13);
				break;
			
			case 'Z':
			case 'z':
				AddLine(0,2);
				AddLine(2,12);
				AddLine(12,14);
				break;
			
			default:
		}
		charOff.x += 1.25;
	}
	
	var lineObj = new THREE.LineSegments( lineGeometry, lineMaterial );
	return lineObj;
}