const valid_extensions = ['jpg','jpeg','png','webp'];

export const fileFilter = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {

    if ( !file ) return callback( new Error('File is empty.'), false );

    const file_extension = file.mimetype.split('/')[1];
    if (  valid_extensions.includes( file_extension ) ) {
        return callback( null, true )
    }

    callback(null, false );
}
