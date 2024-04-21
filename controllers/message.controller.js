module.exports.sendMessage = (req,res,next) => {
    
    try {
        
    }catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message
        })
    }
}