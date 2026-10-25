export class QuestSystem {
 constructor(){this.reset();}
 reset(){this.read=false;this.sequence=[1,0,2];this.progress=0;this.water=false;this.score=0;this.message='Найдите и прочитайте дневник ботаника.';}
 journal(){this.read=true;this.message=this.water?'Вода восстановлена. Исследуйте оранжерею.':'Откройте воду: вентиль II → I → III.';}
 valve(index){if(!this.read)return 'Сначала прочитайте дневник: там записана последовательность.';if(this.water)return 'Водяная система уже восстановлена.';
 if(index===this.sequence[this.progress]){this.progress++;if(this.progress===3){this.water=true;this.score+=100;this.message='Подача воды восстановлена!';return 'Трубы наполнились водой! +100 очков';}return `Верно. Вентили: ${this.progress}/3.`;}
 this.progress=0;return 'Неверный порядок. Механизм сброшен. Попробуйте II → I → III.';}
}
