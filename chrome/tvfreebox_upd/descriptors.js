var keyboard_report_descriptor = [
	0x05, 0x01, /* Usage Page (Desktop), */
	0x09, 0x06, /* Usage (Keyboard), */
	0xA1, 0x01, /* Collection (Application), */
		/* 1 item containing one unicode character */
		0x05, 0x10, /* Usage Page (Unicode), */
		0x08, /* Usage (00h), */
		0x95, 0x01, /* Report Count (1), */
		0x75, 0x20, /* Report Size (32), */
		0x14, /* Logical Minimum (0), */
		0x25, 0xFF, /* Logical Maximum (-1), */
		0x81, 0x06, /* Input (Variable, Relative), */
		/* 1 item containing one keyboard scancode */
		0x95, 0x01, /* Report Count (1), */
		0x75, 0x08, /* Report Size (8), */
		0x15, 0x00, /* Logical Minimum (0), */
		0x26, 0xFF, 0x00, /* Logical Maximum (255), */
		0x05, 0x07, /* Usage Page (Keyboard), */
		0x19, 0x00, /* Usage Minimum (None), */
		0x2A, 0xFF, 0x00, /* Usage Maximum (FFh), */
		0x81, 0x00, /* Input, */
	0xC0 /* End Collection */
];
var mouse_report_descriptor = [ 
	0x05, 0x01, /* Usage Page (Desktop), */
	0x09, 0x02, /* Usage (Mouse), */
	0xA1, 0x01, /* Collection (Application), */
		0x05, 0x09, /* Usage Page (Button), */
		0x19, 0x01, /* Usage Minimum (01h), */
		0x29, 0x03, /* Usage Maximum (03h), */
		0x15, 0x00, /* Logical Minimum (0), */
		0x25, 0x01, /* Logical Maximum (1), */
		0x75, 0x01, /* Report Size (1), */
		0x95, 0x03, /* Report Count (3), */
		0x81, 0x02, /* Input (Variable), */
		0x75, 0x05, /* Report Size (5), */
		0x95, 0x01, /* Report Count (1), */
		0x81, 0x01, /* Input (Constant), */
		0x05, 0x01, /* Usage Page (Desktop), */
		0x09, 0x30, /* Usage (X), */
		0x09, 0x31, /* Usage (Y), */
		0x09, 0x38, /* Usage (Wheel), */
		0x15, 0x81, /* Logical Minimum (-127), */
		0x26, 0x80, 0x00, /* Logical Maximum (128), */
		0x75, 0x08, /* Report Size (8), */
		0x95, 0x03, /* Report Count (3), */
		0x81, 0x06, /* Input (Variable, Relative), */
	0xC0, /* End Collection, */
];